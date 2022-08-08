<script>
  import { Title, Menu } from "../stores/Navigation";
  import { getRestaurants } from "../network/Resellers";
  import { Views, Utils } from "@ikomida/components";
  import { StatusBar } from "../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit, faSync } from "@fortawesome/free-solid-svg-icons";
  import { AppLauncher } from "@capacitor/app-launcher";
  import { Clipboard } from "@capacitor/clipboard";
  import Cache from "../stores/Cache";

  let restaurants;
  let errorAlert;
  let showAlert = false;

  const CACHE_NAME = "RESTAURANTS";
  let hasMore = true;
  let canGetMore = true;
  let lastTimestamp = null;

  async function getMore(e, refresh = false) {
    if (refresh || (canGetMore && hasMore)) {
      const timestamp = refresh
        ? 0
        : restaurants?.[restaurants.length - 1]?.timestamp ?? -1;
      canGetMore = false;
      restaurants = Cache.getObject(CACHE_NAME);
      const newRestaurants = await getRestaurants(timestamp);
      hasMore = newRestaurants.length > 0;
      restaurants = refresh
        ? newRestaurants
        : restaurants
        ? [...restaurants, ...newRestaurants]
        : newRestaurants;
      restaurants.sort((item1, item2) => item2.timestamp - item1.timestamp);
      Cache.setObject(CACHE_NAME, restaurants);
      canGetMore = refresh || lastTimestamp !== timestamp;
      lastTimestamp = timestamp;
    }
  }

  onMount(async () => {
    restaurants = Cache.getObject(CACHE_NAME);
    if (!restaurants) {
      await getMore(null, true);
    }
  });
  async function refresh() {
    await getMore(null, true);
  }

  Menu.addItem({ name: "Atualizar", icon: faSync, callback: refresh });

  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }

  async function newRestaurant() {
    const url = "https://ikomida.com";
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
  {#if restaurants.length > 0}
    <section>
      {#each restaurants as restaurant}
        <article>
          <h2>{restaurant.restaurantName}</h2>
          <div>ikomidaID: {restaurant.ikomidaID}</div>
          <div>Telefone: {Utils.Strings.formatAsPhone(restaurant.phone)}</div>
          <div>
            Data: {Utils.Strings.dateToDateString(restaurant.createdAt)}
          </div>
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
    <Views.CentredMessage text="Não há restaurantes para exibir!" />
  {/if}
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
