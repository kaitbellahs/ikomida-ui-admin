<script lang="ts">
  import { associate, unAssociate } from '../../network/Contracts'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { onMount } from 'svelte'
  import Routes from '../../stores/Routes'
  import ExpandableBox from '@ikomida/shared-frontend/lib/components/ExpandableBox.svelte'

  const router = Stores.Navigation.instance.router

  let userInfo: Types.Classes.CUser

  $: contract = Types.Classes.CContract.fromObject($router.options) as Types.Classes.CContract

  const associateToMe = async (id?: string, appId?: string) => {
    Stores.Loading.instance.start()
    const response = await associate(id, appId)
    if (response?.success) {
      contract.apps = contract?.apps?.map(app => {
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
      contract.apps = contract?.apps?.map(app => {
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

  const goTo = async (route: Symbol, contract?: Types.Classes.CContract) => {
    Stores.Loading.instance.start()
    if (contract) {
      ;(Stores.Navigation.instance as Stores.Navigation).goTo(route, contract)
    } else {
      Stores.MessageAlert.instance.show('Aconteceu um erro inesperado!')
    }
    Stores.Loading.instance.stop()
  }

  onMount(async () => {
    userInfo = await Utils.Jws.extractToken((await Stores.Auth.Auth.instance.data()) ?? '')
    Stores.Loading.instance.stop()
  })
  $: Stores.Title.instance.set(contract?.contractName ?? 'Contrato')
</script>

<article>
  <h2>{contract?.contractName ?? '-'}</h2>
  <div>ikomidaID: {contract.ikomidaID}</div>
  <div>Plano: {contract?.plan?.name}</div>
  <div>Plano: {contract?.plan?.price} / mes</div>
  <div>Situação: {contract?.status}</div>
  <div>CNPJ: {contract?.contractIdentity}</div>
  <div>email: {contract?.email}</div>
  <div>Nome do responsável: {contract?.name} {contract?.lastName}</div>
  <div>Telefone: +{contract?.areaCode} {contract?.phone}</div>
  <Views.ExpandableBox title="Gerenciar contrato">
    <Views.Button sizeMultiplier={0.9} on:click={async () => await goTo(Routes.products, contract)}
      >Gerenciar produtos</Views.Button
    >
    <Views.Button sizeMultiplier={0.9} on:click={async () => await goTo(Routes.vendorApps, contract)}
      >Gerenciar apps</Views.Button
    >
    <Views.Button sizeMultiplier={0.9} on:click={async () => await goTo(Routes.vendorLayout, contract)}
      >Layout</Views.Button
    >
    <Views.Button sizeMultiplier={0.9} on:click={async () => await goTo(Routes.vendorSettings, contract)}
      >Configuracoes</Views.Button
    >
    <Views.Button sizeMultiplier={0.9} on:click={async () => await goTo(Routes.vendorLimits, contract)}
      >Limits</Views.Button
    >
    <Views.Button sizeMultiplier={0.9} on:click={async () => await goTo(Routes.vendorSubscription, contract)}
      >Assinatura</Views.Button
    >
  </Views.ExpandableBox>
  <div class="apps">
    {#if contract.apps}
      {#each contract.apps as app}
        <div>
          <div>
            Plataforma: {app.platform ?? '-'}
          </div>
          <div>
            Responsável: {app.managedBy?.name ?? 'não associado'}
          </div>
          {#if !app.managedBy?.id}
            <Views.Button sizeMultiplier={0.8} on:click={async () => await associateToMe(contract.id, app.id)}
              >Associar comigo</Views.Button
            >
          {:else if app?.managedBy?.id === userInfo?.id}
            <Views.Button sizeMultiplier={0.8} on:click={async () => await unAssociateWithMe(contract.id, app.id)}
              >Desassociar comigo</Views.Button
            >
          {/if}
          <div>Situação: {app.storeStatus?.name ?? '-'}</div>
        </div>
      {/each}
    {:else}
      <Views.CentredMessage text="Não há apps para exibir." />
    {/if}
  </div>
  <div>
    Inscrição: {Utils.Strings.dateToDateString(contract.createdAt)}
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
