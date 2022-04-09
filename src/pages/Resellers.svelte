<script>
  import { Title, Navigation, Routes } from "../stores/Navigation";
  import { getResellers } from "../network/Resellers";
  import { Views, Utils } from "@tian/components";
  import { StatusBar } from "../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit } from "@fortawesome/free-solid-svg-icons";
  let resellers;
  onMount(async () => {
    resellers = await getResellers();
  });
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
