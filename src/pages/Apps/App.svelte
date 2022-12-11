<script lang="ts">
  import { status } from '../../network/Apps'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { onMount } from 'svelte'
  import AppStoreStatus from '../../types/AppStoreStatus'
  import AppStorePublishStatus from '../../types/AppStorePublishStatus'

  let router = Stores.Navigation.instance.router
  let oldAppStoreStatusSelected: AppStoreStatus
  let appStoreStatusSelected: AppStoreStatus
  let AppStorePublishStatusSelected
  let item: Types.Classes.CApp = Types.Classes.CApp.fromObject($router.options)
  let userInfo: Types.Classes.CUser

  // $: if (item) {
  //   appStoreStatusSelected = oldAppStoreStatusSelected =
  //     new AppStoreStatus().list?.filter(
  //       (type) => type.id === item?.storeStatus
  //     )?.[0];
  // }

  $: if (appStoreStatusSelected !== oldAppStoreStatusSelected && appStoreStatusSelected?.id) {
    updateStoreStatus(item?.id, appStoreStatusSelected)
  }
  // $: if (AppStorePublishStatusSelected?.id) {
  //   updateStoreBuildStatus(item?.id, AppStorePublishStatusSelected?.id);
  // }Stores.MessageAlert.instance.show

  const updateStoreStatus = async (id?: string, storeStatus?: AppStoreStatus) => {
    Stores.Loading.instance.start()
    let object: Types.Classes.CApp = Types.Classes.CApp.fromObject({
      storeStatus
    })
    let response
    response = await status(id, object)
    if (response?.success) {
    } else {
      Stores.MessageAlert.instance.show(response?.data)
    }
    Stores.Loading.instance.stop()
  }

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
    userInfo = await Utils.Jws.extractToken((await Stores.Auth.Auth.instance.data()) ?? '')
    appStoreStatusSelected = oldAppStoreStatusSelected = AppStoreStatus.values().filter(
      type => type.id === item.storeStatus
    )?.[0]
    Stores.Loading.instance.stop()
  })
  $: Stores.Title.instance.set(item?.displayName ?? 'App')
</script>

<article>
  <h2>{item?.displayName ?? '-'}</h2>
  <!-- <Views.Selector
    name="Atualizar situação do build da loja"
    bind:selected={AppStorePublishStatusSelected}
    options={new AppStorePublishStatus().list}
  /> -->
  <div>
    <div>bundleId:</div>
    <b>{item?.bundleId}</b>
  </div>
  <div class="cell">
    <div>Situação:</div>
    <div>
      <Views.Selector
        marginTop={0}
        name="Atualizar situação da loja"
        bind:selected={appStoreStatusSelected}
        options={AppStoreStatus.values()}
      />
    </div>
  </div>
  <div>
    <div>fireBase Id:</div>
    <b>{item?.fireBaseId ?? '-'}</b>
  </div>
  <div>
    <div>iOS Profile Id:</div>
    <b>{item?.iOSProfileId ?? '-'}</b>
  </div>
  <div>
    <div>Versão:</div>
    <Views.TextEdit
      placeHolder="Versão"
      type={Types.TTextEdit.GENERIC}
      bind:value={item.version}
      initialValue={item.version}
    />
  </div>
  <div>
    <Views.TextEdit
      placeHolder="Versão da loja"
      type={Types.TTextEdit.GENERIC}
      bind:value={item.storeVersion}
      initialValue={item.storeVersion}
    />
  </div>
  <div>
    <div>Plataforma:</div>
    <b>{item?.platform ?? '-'} </b>
  </div>
  <div>
    <div>Situação do Build da loja:</div>
    <b>{item.storeBuildStatus ? AppStorePublishStatus.valueOf(item.storeBuildStatus)?.name : '-'} </b>
  </div>
  <div>
    <div>Evidencias:</div>
    <b>{item?.storeEvidences ?? '-'} </b>
  </div>
  <div>
    <Views.TextEdit
      placeHolder="Nota"
      type={Types.TTextEdit.TEXT}
      bind:value={item.storeNote}
      initialValue={item.storeNote}
    />
  </div>
  <div>
    <Views.Selector
      marginTop={0}
      name="Situação da publicação"
      bind:selected={item.storePublishStatus}
      options={AppStoreStatus.values()}
    />
  </div>
  <div>
    <div>Ativo:</div>
    <b>{item.active ? ' Sim' : 'Não'}</b>
  </div>
  <div>
    <div>Criação:</div>
    <b>{Utils.Strings.dateToDateString(item.createdAt)} </b>
  </div>
</article>

<style>
  article {
    position: relative;
    border-radius: 4pt;
  }
  article > div {
    background: rgb(255, 255, 255);
    border-radius: 8pt;
    padding: 16pt;
    margin: 8pt 0;
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
    align-items: center;
  }
  article > div > *:not(:first-child) {
    margin-left: 16pt;
  }
</style>
