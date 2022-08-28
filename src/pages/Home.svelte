<script>
  import {
    countResellers,
    countRestaurants,
    countProducts,
    countOrders,
    countUsers,
    countCoupons,
  } from "../network/Quantities";
  import { Views, Stores } from "@ikomida/components";
  import { onMount } from "svelte";

  onMount(async () => {
    Stores.Loading.instance.stop();
  });

  Stores.Title.instance.set("Admin");
</script>

<section>
  <article>
    {#await countRestaurants()}
      <Views.LocalLoading />
    {:then restaurantsCount}
      <span class="count">{restaurantsCount}</span>
      <span class="name">Restaurantes</span>
    {/await}
  </article>
  <article>
    {#await countResellers()}
      <Views.LocalLoading />
    {:then resellersCount}
      <span class="count">{resellersCount}</span>
      <span class="name">Vendedores</span>
    {/await}
  </article>
  <article>
    {#await countProducts()}
      <Views.LocalLoading />
    {:then productsCount}
      <span class="count">{productsCount}</span>
      <span class="name">produtos</span>
    {/await}
  </article>
  <article>
    {#await countOrders()}
      <Views.LocalLoading />
    {:then ordersCount}
      <span class="count">{ordersCount}</span>
      <span class="name">pedidos</span>
    {/await}
  </article>
  <article>
    {#await countUsers()}
      <Views.LocalLoading />
    {:then usersCount}
      <span class="count">{usersCount}</span>
      <span class="name">Clientes</span>
    {/await}
  </article>
  <article>
    {#await countCoupons()}
      <Views.LocalLoading />
    {:then couponsCount}
      <span class="count">{couponsCount}</span>
      <span class="name">Cupons</span>
    {/await}
  </article>
</section>

<style>
  section {
    display: flex;
    flex-wrap: wrap;
  }
  section > article {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 5px;
    width: 50%;
    display: flex;
    flex-direction: column;
    flex-basis: 40%;
    text-shadow: 0.5px 1px #18056b66;
    box-shadow: 1px 1.5px #00000099;
  }
  section > article > .name {
    width: 100%;
    font-size: 1.2em;
    font-family: RobotoBold;
    text-align: center;
  }
  section > article > .count {
    width: 100%;
    font-size: 3em;
    color: #4c0708;
    text-align: center;
  }
</style>
