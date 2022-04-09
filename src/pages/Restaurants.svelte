<script>
  import { Title } from "../stores/Navigation";
  import { getRestaurants } from "../network/Resellers";
  import { Views, Utils } from "@tian/components";
  import { StatusBar } from "../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit } from "@fortawesome/free-solid-svg-icons";
  import { AppLauncher } from "@capacitor/app-launcher";
  import { Clipboard } from "@capacitor/clipboard";

  let restaurants;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }
  onMount(async () => {
    restaurants = await getRestaurants();
  });
  async function newRestaurant() {
    const url = "https://tialtonivel.com.br";
    const { value } = await AppLauncher.canOpenUrl({ url });
    if (value) {
      await AppLauncher.openUrl({ url });
    } else {
      await Clipboard.write({ string: url });
      toggleErrorAlert(
        `Não foi possível abrir navigador externo: por favor abrir o seu navigaro e digitar esa URL: ${url}, também foi copiado para sua área de transferência!`
      );
    }
  }
  Title.set("Lista de retaurantes");
</script>

{#if !restaurants}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{:else}
  <Views.Button
    on:click={newRestaurant}
    bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Cadastrar novo Restaurante</span></Views.Button
  >
  <Views.Divider />
  <section>
    {#if restaurants.length > 0}
      {#each restaurants as restaurant}
        <article>
          <h2>{restaurant.restaurantName}</h2>
          <div>Telefone: {Utils.Strings.formatAsPhone(restaurant.phone)}</div>
          <div>
            Data: {Utils.Strings.dateToDateString(restaurant.createdAt)}
          </div>
        </article>
      {/each}
    {:else}
      Não há restaurantes para exibir!
    {/if}
  </section>
{/if}
<Views.MessageAlert object={errorAlert} bind:show={showAlert} />

<style>
  section > article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
  }
</style>
