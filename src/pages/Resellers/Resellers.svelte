<script>
  import { Title, Navigation, Routes, Menu } from "../../stores/Navigation";
  import { getResellers } from "../../network/Resellers";
  import { Views, Utils } from "@ikomida/components";
  import { StatusBar } from "../../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit, faSync } from "@fortawesome/free-solid-svg-icons";
  import Cache from "../../stores/Cache";
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
      resellers = Cache.getObject(CACHE_NAME);
      const newResellers = await getResellers(timestamp);
      hasMore = newResellers.length > 0;
      resellers = refresh
        ? newResellers
        : resellers
        ? [...resellers, ...newResellers]
        : newResellers;
      resellers.sort((item1, item2) => item2.timestamp - item1.timestamp);
      Cache.setObject(CACHE_NAME, resellers);
      canGetMore = refresh || lastTimestamp !== timestamp;
      lastTimestamp = timestamp;
    }
  }

  onMount(async () => {
    resellers = Cache.getObject(CACHE_NAME);
    if (!resellers) {
      await getMore(null, true);
    }
  });

  async function refresh() {
    await getMore(null, true);
  }

  Menu.addItem({ name: "Atualizar", icon: faSync, callback: refresh });

  async function newReseller() {
    Navigation.goTo(Routes.newReseller);
  }
  Title.set("Lista de vendedores");
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
  <section>
    {#if resellers.length > 0}
      {#each resellers as reseller}
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
    {:else}
      Não há vendedores cadastrados para exibir!
    {/if}
  </section>
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
