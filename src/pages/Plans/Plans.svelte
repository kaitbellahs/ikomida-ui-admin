<script lang="ts">
  import Routes from '../../stores/Routes'
  import { activatePlan } from '../../network/Plans'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { AppLauncher } from '@capacitor/app-launcher'
  import { Clipboard } from '@capacitor/clipboard'
  import { StatusBar } from '../../stores/Setup'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit, faCopy, faExternalLink } from '@fortawesome/free-solid-svg-icons'

  let items: Types.Classes.CPlan[]

  $: if (items) {
    items = Types.Classes.CPlan.fromObject(items)
  }

  onMount(async () => {
    Stores.Loading.instance.stop()
  })

  async function newPlan(plan?: Types.Classes.CPlan, edit = false) {
    const options = {
      item: plan ?? Types.Classes.CPlan.fillWith(null),
      edit
    }
    Stores.Navigation.instance.goTo(Routes.newPlan, options)
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
  async function openPlan(plan: Types.Classes.CPlan) {
    const url = `https://${window.host}/checkout/${plan.id}/${plan.dueDateAfterXDays}`
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

<div style="padding: 0 16pt;">
  <Views.Button on:click={async () => await newPlan} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Novo plano</span></Views.Button
  >
</div>
<Views.LoadMoreReusableList
  noItems="Não há planos para exibir!"
  cache={Stores.Cache.Types.PLANS}
  url="/admin/plans"
  bind:items
  let:index
>
  <article class="shadow">
    <Views.FloatEdit callback={async () => await newPlan(items[index], true)} />
    <Views.FloatButton icon={faCopy} right={40} callback={async () => await newPlan(items[index])} />
    <Views.FloatButton icon={faExternalLink} right={80} callback={async () => await openPlan(items[index])} />
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
    border-radius: 8pt;
    padding: 16pt;
  }
</style>
