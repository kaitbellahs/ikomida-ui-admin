<script>
  import Routes from "../../stores/Routes";
  import { getResellers } from "../../network/Resellers";
  import { Views, Utils, Stores } from "@ikomida/components";

  import { StatusBar } from "../../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit, faSync } from "@fortawesome/free-solid-svg-icons";
  let resellers;

  const CACHE_NAME = "RESELLERS";
  let hasMore = true;
  let canGetMore = true;
  let lastTimestamp = null;

  async function getMore(e, refresh = false) {
    if (refresh || (canGetMore && hasMore)) {
      const timestamp = refresh
        ? 0
        : resellers?.[resellers.length - 1]?.timestamp ?? -1;
      canGetMore = false;
      resellers = Stores.Cache.instance?.getObject(CACHE_NAME);
      const newResellers = await getResellers(timestamp);
      hasMore = newResellers.length > 0;
      resellers = refresh
        ? newResellers
        : resellers
        ? [...resellers, ...newResellers]
        : newResellers;
      resellers.sort((item1, item2) => item2.timestamp - item1.timestamp);
      Stores.Cache.instance?.setObject(CACHE_NAME, resellers);
      canGetMore = refresh || lastTimestamp !== timestamp;
      lastTimestamp = timestamp;
    }
  }

  onMount(async () => {
    resellers = Stores.Cache.instance?.getObject(CACHE_NAME);
    if (!resellers) {
      await getMore(null, true);
    }
  });

  async function refresh() {
    await getMore(null, true);
  }

  Stores.Menu.instance.addItem({
    name: "Atualizar",
    icon: faSync,
    callback: refresh,
  });

  async function newReseller() {
    Stores.Navigation.instance.goTo(Routes.newReseller);
  }
  Stores.Title.instance.set("Lista de vendedores");
</script>

{#if !resellers}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{:else}
  <Views.Button on:click={newReseller} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Novo vendedor</span></Views.Button
  >
  <Views.Divider />
  {#if resellers.length > 0}
    <section>
      {#each resellers as reseller (reseller?.id)}
        <article>
          <h2>{reseller.name} {reseller.lastName}</h2>
          <div>Telefone: {Utils.Strings.formatAsPhone(reseller.phone)}</div>
          <div>Grau: {reseller.degree}</div>
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
    <Views.CentredMessage text="Não há vendedores cadastrados para exibir!" />
  {/if}
{/if}

<style>
  section > article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
  }
</style>
