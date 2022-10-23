<script lang="ts">
  import { getApp } from '../../network/Apps'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { StatusBar } from '../../stores/Setup'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'
  import { AppLauncher } from '@capacitor/app-launcher'
  import { Clipboard } from '@capacitor/clipboard'
  import Routes from '../../stores/Routes'

  let items: Types.Classes.CApp[]

  onMount(async () => {
    Stores.Loading.instance.stop()
  })

  async function newApp() {
    const url = 'https://ikomida.com'
    const { value } = await AppLauncher.canOpenUrl({ url })
    if (value) {
      await AppLauncher.openUrl({ url })
    } else {
      await Clipboard.write({ string: url })
      Stores.MessageAlert.instance.show(
        `Não foi possível abrir navigador externo: por favor abrir o seu navigaro e digitar esa URL: ${url}, também foi copiado para sua área de transferência!`
      )
    }
  }

  async function openApp(id?: string) {
    const response = await getApp(id)
    if (response?.success) {
      Stores.Navigation.instance.goTo(Routes.app, response?.data)
    } else {
      Stores.MessageAlert.instance.show(response?.data)
    }
  }

  Stores.Title.instance.set('Lista de apps')
</script>

<Views.Button on:click={newApp} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Cadastrar novo Appe</span></Views.Button
>
<Views.LoadMoreReusableList
  noItems="Não há apps para exibir!"
  cache={Stores.Cache.Types.APPS}
  url="/admin/apps"
  bind:items
  let:index
>
  <article on:click={async () => await openApp(items[index].id)}>
    <h2>{items[index].displayName ?? '-'}</h2>
    <div>bundleId: {items[index].bundleId}</div>
    <!-- <div>Situação: {new AppStoreStatus(items[index].storeStatus).name}</div> -->
    <div>Versão: {items[index].version ?? '-'}</div>
    <div>
      Plataforma: {items[index].platform ?? '-'}
    </div>
    <div>
      Ativo: {items[index].active ?? '-'}
    </div>
    <div>
      Criação: {Utils.Strings.dateToDateString(items[index].createdAt)}
    </div>
  </article>
</Views.LoadMoreReusableList>

<style>
  article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
  }
  article > div {
    background: #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 5px 0;
    display: flex;
    flex-direction: row;
  }
</style>
