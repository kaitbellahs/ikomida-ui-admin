<script>
  import { associate, unAssociate } from "../../network/Contracts";
  import { StatusBar } from "../../stores/Setup";
  import { Views, Utils, Stores } from "@ikomida/components";
  import { onMount } from "svelte";
  import AppStoreStatus from "../../types/AppStoreStatus";

  let userInfo;
  let router = Stores.Navigation.instance.router;

  $: item = $router.options;

  const associateToMe = async (id, appId) => {
    Stores.Loading.instance.start();
    let response;
    response = await associate(id, appId);
    if (response?.success) {
      item.apps = item?.apps?.map((app) => {
        if (app?.id === appId) {
          app.managedBy = response?.data;
        }
        return app;
      });
    } else {
      Stores.MessageAlert.instance.show(response?.data);
    }
    Stores.Loading.instance.stop();
  };

  const unAssociateWithMe = async (id, appId) => {
    Stores.Loading.instance.start();
    let response;
    response = await unAssociate(id, appId);
    if (response?.success) {
      item.apps = item?.apps?.map((app) => {
        if (app?.id === appId) {
          app.managedBy = response?.data;
        }
        return app;
      });
    } else {
      Stores.MessageAlert.instance.show(response?.data);
    }
    Stores.Loading.instance.stop();
  };

  onMount(async () => {
    userInfo = await Utils.Jws.extractToken(
      await Stores.Auth.Auth.instance.data()
    );
    Stores.Loading.instance.stop();
  });
  $: Stores.Title.instance.set(item?.contractName ?? "Contrato");
</script>

<article>
  <h2>{item?.contractName ?? "-"}</h2>
  <div>ikomidaID: {item.ikomidaID}</div>
  <div>Plano: {item?.plan?.name}</div>
  <div>Plano: {item?.plan?.price} / mes</div>
  <div>Situação: {item?.status}</div>
  <div>CNPJ: {item?.cnpj}</div>
  <div>email: {item?.email}</div>
  <div>Nome do responsável: {item?.name} {item?.lastName}</div>
  <div>Telefone: +{item?.areaCode} {item?.phone}</div>
  <div class="apps">
    {#each item?.apps as app}
      <div>
        <div>
          Plataforma: {app?.platform ?? "-"}
        </div>
        <div>
          Responsável: {app?.managedBy?.name ?? "não associado"}
        </div>
        {#if !app?.managedBy?.id}
          <Views.Button
            multiplier={0.8}
            on:click={associateToMe(item?.id, app?.id)}
            >Associar comigo</Views.Button
          >
        {:else if app?.managedBy?.id === userInfo?.id}
          <Views.Button
            multiplier={0.8}
            on:click={unAssociateWithMe(item?.id, app?.id)}
            >Desassociar comigo</Views.Button
          >
        {/if}
        <div>Situação: {new AppStoreStatus(app?.storeStatus).name}</div>
      </div>
    {/each}
  </div>
  <div>
    Inscrição: {Utils.Strings.dateToDateString(item.createdAt)}
  </div>
</article>

<style>
  article {
    position: relative;
    border-radius: 4px;
  }
  article > .apps > div {
    background: #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 10px 0;
  }
</style>
