<script lang="ts">
  import { associate, unAssociate } from '../../network/Contracts'
  import { StatusBar } from '../../stores/Setup'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { onMount } from 'svelte'
  import AppStoreStatus from '../../types/AppStoreStatus'

  let userInfo: Types.Classes.CUser
  let router = Stores.Navigation.instance.router

  $: item = $router.options as Types.Classes.CContract

  const associateToMe = async (id?: string, appId?: string) => {
    Stores.Loading.instance.start()
    const response = await associate(id, appId)
    if (response?.success) {
      item.apps = item?.apps?.map(app => {
        if (app?.id === appId) {
          app.managedBy = Types.Classes.CUser.fromObject(response.data)
        }
        return app
      })
    } else {
      Stores.MessageAlert.instance.show(response.data)
    }
    Stores.Loading.instance.stop()
  }

  const unAssociateWithMe = async (id?: string, appId?: string) => {
    Stores.Loading.instance.start()
    const response = await unAssociate(id, appId)
    if (response?.success) {
      item.apps = item?.apps?.map(app => {
        if (app?.id === appId) {
          app.managedBy = Types.Classes.CUser.fromObject(response.data)
        }
        return app
      })
    } else {
      Stores.MessageAlert.instance.show(response?.data)
    }
    Stores.Loading.instance.stop()
  }

  onMount(async () => {
    userInfo = await Utils.Jws.extractToken((await Stores.Auth.Auth.instance.data()) ?? '')
    Stores.Loading.instance.stop()
  })
  $: Stores.Title.instance.set(item?.contractName ?? 'Contrato')
</script>

<article>
  <h2>{item?.contractName ?? '-'}</h2>
  <div>ikomidaID: {item.ikomidaID}</div>
  <div>Plano: {item?.plan?.name}</div>
  <div>Plano: {item?.plan?.price} / mes</div>
  <div>Situação: {item?.status}</div>
  <div>CNPJ: {item?.contractIdentity}</div>
  <div>email: {item?.email}</div>
  <div>Nome do responsável: {item?.name} {item?.lastName}</div>
  <div>Telefone: +{item?.areaCode} {item?.phone}</div>
  <div class="apps">
    {#if item.apps}
      {#each item.apps as app}
        <div>
          <div>
            Plataforma: {app.platform ?? '-'}
          </div>
          <div>
            Responsável: {app.managedBy?.name ?? 'não associado'}
          </div>
          {#if !app.managedBy?.id}
            <Views.Button sizeMultiplier={0.8} on:click={async () => await associateToMe(item.id, app.id)}
              >Associar comigo</Views.Button
            >
          {:else if app?.managedBy?.id === userInfo?.id}
            <Views.Button sizeMultiplier={0.8} on:click={async () => await unAssociateWithMe(item.id, app.id)}
              >Desassociar comigo</Views.Button
            >
          {/if}
          <div>Situação: {app.storeStatus ? AppStoreStatus.valueOf(app.storeStatus)?.name : '-'}</div>
        </div>
      {/each}
    {:else}
      <Views.CentredMessage text="Não há apps para exibir." />
    {/if}
  </div>
  <div>
    Inscrição: {Utils.Strings.dateToDateString(item.createdAt)}
  </div>
</article>

<style>
  article {
    position: relative;
    border-radius: 4pt;
  }
  article > .apps > div {
    background: #ccc;
    border-radius: 8pt;
    padding: 16pt;
    margin: 16pt 0;
  }
</style>
