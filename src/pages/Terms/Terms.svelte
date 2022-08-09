<script>
  import { Title, Navigation, Routes, Menu } from "../../stores/Navigation";
  import { getTerms, removeTerm, activateTerm } from "../../network/Terms";
  import { Views, Utils, Types } from "@ikomida/components";
  import { StatusBar } from "../../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import {
    faEdit,
    faTrashAlt,
    faSync,
  } from "@fortawesome/free-solid-svg-icons";
  import Cache from "../../stores/Cache";
  let terms;

  const CACHE_NAME = "TERMS";
  let hasMore = true;
  let canGetMore = true;
  let lastTimestamp = null;

  async function getMore(e, refresh = false) {
    if (refresh || (canGetMore && hasMore)) {
      const timestamp = refresh
        ? 0
        : terms?.[terms.length - 1]?.timestamp ?? -1;
      canGetMore = false;
      terms = Cache.getObject(CACHE_NAME);
      const newTerms = await getTerms(timestamp);
      hasMore = newTerms.length > 0;
      terms = refresh ? newTerms : terms ? [...terms, ...newTerms] : newTerms;
      terms.sort((item1, item2) => item2.timestamp - item1.timestamp);
      Cache.setObject(CACHE_NAME, terms);
      canGetMore = refresh || lastTimestamp !== timestamp;
      lastTimestamp = timestamp;
    }
  }

  onMount(async () => {
    terms = Cache.getObject(CACHE_NAME);
    if (!terms) {
      await getMore(null, true);
    }
  });

  async function refresh() {
    await getMore(null, true);
  }

  Menu.addItem({ name: "Atualizar", icon: faSync, callback: refresh });

  let isLoading = false;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }
  async function newTerm() {
    Navigation.goTo(Routes.newTerm, {
      item: {
        id: null,
        name: null,
        text: null,
        type: null,
        active: null,
      },
      edit: false,
    });
  }
  async function editTerm(item) {
    Navigation.goTo(Routes.newTerm, {
      item,
      edit: true,
    });
  }
  async function onRemoveClick(id) {
    isLoading = true;
    let response = await removeTerm(id);
    if (response.success) {
      terms = await getTerms();
    } else {
      toggleErrorAlert(response?.data);
      isLoading = false;
      return;
    }
    isLoading = false;
  }
  async function onActivateClick(id, event) {
    const checked = event.detail?.checked;

    isLoading = true;
    let response = await activateTerm({
      id,
      active: !checked,
    });
    if (response && response?.success) {
      terms = await getTerms();
    } else {
      isLoading = false;
      toggleErrorAlert(response?.data);
      terms = terms.map((term) => {
        if (term?.id === id) {
          term.active = !checked;
        }
        return term;
      });
    }
    isLoading = false;
  }
  Title.set("Configurções");
</script>

<Views.Button on:click={newTerm} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Novo termo</span></Views.Button
>
<Views.Divider />
{#if terms}
  {#if terms.length > 0}
    <section>
      {#each terms as term}
        <article>
          <Views.FloatEdit callback={() => editTerm(term)} top="45" />
          <h2>{term.name}</h2>
          <div>Tipo: {new Types.TermTypes(term.type).description}</div>

          <Views.Switch
            name="Ativo:"
            bind:checked={term.active}
            on:check={(event) => onActivateClick(term.id, event)}
          />
        </article>
      {/each}
      <Views.Divider />
      {#if hasMore && !canGetMore}
        <Views.LocalLoading />
      {:else}
        <Views.Button disabled={!hasMore || !canGetMore} on:click={getMore}
          >carregar mais</Views.Button
        >
      {/if}
    </section>
  {:else}
    <Views.CentredMessage text="Não há termos cadastradas para exibir!" />
  {/if}
{/if}

{#if isLoading || !terms}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{/if}

<Views.MessageAlert object={errorAlert} bind:show={showAlert} />

<style>
  section > article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
  }
</style>
