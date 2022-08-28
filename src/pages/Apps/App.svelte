<script>
  import { status } from "../../network/Apps";
  import { StatusBar } from "../../stores/Setup";
  import { Views, Utils, Stores } from "@ikomida/components";
  import { onMount } from "svelte";
  import AppStoreStatus from "../../types/AppStoreStatus";
  import AppStorePublishStatus from "../../types/AppStorePublishStatus";

  let router = Stores.Navigation.instance.router;
  let oldAppStoreStatusSelected;
  let appStoreStatusSelected;
  let AppStorePublishStatusSelected;
  $: item = $router.options;

  // $: if (item) {
  //   appStoreStatusSelected = oldAppStoreStatusSelected =
  //     new AppStoreStatus().list?.filter(
  //       (type) => type.id === item?.storeStatus
  //     )?.[0];
  // }

  $: if (
    appStoreStatusSelected !== oldAppStoreStatusSelected &&
    appStoreStatusSelected?.id
  ) {
    updateStoreStatus(item?.id, appStoreStatusSelected?.id);
  }
  // $: if (AppStorePublishStatusSelected?.id) {
  //   updateStoreBuildStatus(item?.id, AppStorePublishStatusSelected?.id);
  // }Stores.MessageAlert.instance.show

  const updateStoreStatus = async (id, storeStatus) => {
    Stores.Loading.instance.start();
    let object = {
      storeStatus,
    };
    let response;
    response = await status(id, object);
    if (response?.success) {
    } else {
      Stores.MessageAlert.instance.show(response?.data);
    }
    Stores.Loading.instance.stop();
  };

  // const updateStoreBuildStatus = async (id, storeStatus) => {
  //   Stores.Loading.instance.start()
  //   let object = {
  //     storeStatus,
  //   };
  //   let response;
  //   response = await status(id, object);
  //   if (response?.success) {
  //   } else {
  //     Stores.MessageAlert.instance.show(response?.data);
  //   }
  //   Stores.Loading.instance.stop()
  // };

  onMount(async () => {
    userInfo = await Utils.Jws.extractToken(await Stores.Auth.instance.data());
    appStoreStatusSelected = oldAppStoreStatusSelected =
      new AppStoreStatus().list?.filter(
        (type) => type.id === item?.storeStatus
      )?.[0];
    Stores.Loading.instance.stop();
  });
  $: Stores.Title.instance.set(item?.displayName ?? "App");
</script>

<article>
  <h2>{item?.displayName ?? "-"}</h2>
  <!-- <Views.Selector
    name="Atualizar situação do build da loja"
    bind:selected={AppStorePublishStatusSelected}
    options={new AppStorePublishStatus().list}
  /> -->
  <div>bundleId: <b>{item?.bundleId}</b></div>
  <div class="cell">
    <div>Situação:</div>
    <div>
      <Views.Selector
        marginTop="0"
        name="Atualizar situação da loja"
        bind:selected={appStoreStatusSelected}
        options={new AppStoreStatus().list}
      />
    </div>
  </div>
  <div>fireBase Id: <b>{item?.fireBaseId ?? "-"}</b></div>
  <div>iOS Profile Id: <b>{item?.iOSProfileId ?? "-"}</b></div>
  <div>Versão: <b>{item?.version ?? "-"}</b></div>
  <div>Versão da loja: <b>{item?.storeVersion ?? "-"}</b></div>
  <div>
    Plataforma: <b>{item?.platform ?? "-"} </b>
  </div>
  <div>
    Situação do Build da loja:: <b
      >{new AppStorePublishStatus(item?.storeBuildStatus).name}
    </b>
  </div>
  <div>
    Evidencias: <b>{item?.storeEvidences ?? "-"} </b>
  </div>
  <div>
    Nota: <b>{item?.storeNote ?? "-"} </b>
  </div>
  <div>
    Situação da publicação: <b>{item?.storePublishStatus ?? "-"} </b>
  </div>
  <div>
    Ativo: <b>{item?.active ?? "-"} </b>
  </div>
  <div>
    Criação: <b>{Utils.Strings.dateToDateString(item.createdAt)} </b>
  </div>
</article>

<style>
  article {
    position: relative;
    border-radius: 4px;
  }
  article > div {
    background: #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 5px 0;
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
    align-items: center;
  }
  article > div > * {
    flex: 1 50%;
    flex-grow: 0;
    flex-shrink: 0;
  }
  article > div > b {
    margin-left: 10px;
  }
</style>
