<script lang="ts">
  import Routes from '../../stores/Routes'
  import { activatePlan } from '../../network/Plans'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { AppLauncher } from '@capacitor/app-launcher'
  import { Clipboard } from '@capacitor/clipboard'
  import { StatusBar } from '../../stores/Setup'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'

  let items: Types.Classes.CPlan[]

  $: if (items) {
    items = Types.Classes.CPlan.fromObject(items)
  }

  onMount(async () => {
    Stores.Loading.instance.stop()
  })

  async function newPlan() {
    Stores.Navigation.instance.goTo(Routes.newPlan, {
      item: Types.Classes.CPlan.fillWith(null),
      edit: false
    })
  }

  async function editPlan(plan: Types.Classes.CPlan) {
    Stores.Navigation.instance.goTo(Routes.newPlan, {
      item: plan,
      edit: true
    })
  }

  async function onActivateClick(id?: string, event?: any) {
    const checked = event.detail?.checked

    Stores.Loading.instance.start()
    let response = await activatePlan(
      Types.Classes.CPlan.fromObject({
        id,
        active: !checked
      })
    )
    if (response && response?.success) {
      Stores.LoadMore.instance.refresh()
    } else {
      Stores.Loading.instance.stop()
      Stores.MessageAlert.instance.show(response?.data)
      items = items.map(item => {
        if (item?.id === id) {
          item.active = !checked
        }
        return item
      })
    }
    Stores.Loading.instance.stop()
  }
  async function openPlan(id?: string, name?: string, price?: number) {
    const url = `https://${window.host}/plans/${id}/${name}/${price}`
    const { value } = await AppLauncher.canOpenUrl({ url })
    await AppLauncher.openUrl({ url })
    if (!value) {
      await Clipboard.write({ string: url })
      Stores.MessageAlert.instance.show(
        `Se o navigador externo nao abriu: abra o e digitar essa URL: ${url}, também foi copiado para sua área de transferência para colar-lo!`
      )
    }
  }
  Stores.Title.instance.set('Planos')
</script>

<Views.Button on:click={newPlan} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Novo plano</span></Views.Button
>
<Views.LoadMoreReusableList
  noItems="Não há planos para exibir!"
  cache={Stores.Cache.Types.PLANS}
  url="/admin/plans"
  bind:items
  let:index
>
  <article on:click|self={async () => await openPlan(items[index].id, items[index].name, items[index].price)}>
    <Views.FloatEdit callback={async () => await editPlan(items[index])} />
    <h2>{items[index].name}</h2>
    <div>price: {Utils.Strings.currency(items[index].price)}</div>
    <div>Data: {Utils.Strings.dateToDateString(items[index].createdAt)}</div>
    <Views.Switch
      name="Ativo:"
      bind:checked={items[index].active}
      on:check={async event => await onActivateClick(items[index].id, event)}
    />
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
</style>
