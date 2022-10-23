<script lang="ts">
  import Routes from '../../stores/Routes'
  import { removePlan, activatePlan } from '../../network/Plans'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'

  import { StatusBar } from '../../stores/Setup'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit, faSync } from '@fortawesome/free-solid-svg-icons'

  let items: Types.Classes.CPlan[]

  onMount(async () => {
    Stores.Loading.instance.stop()
  })

  async function newPlan() {
    Stores.Navigation.instance.goTo(Routes.newPlan, {
      item: {
        name: null,
        price: null,
        discount: null,
        discountType: null,
        details: [],
        highlighted: false,
        order: null,
        staff: null,
        products: null,
        orders: null,
        coupons: null,
        billing: null,
        support: []
      },
      edit: false
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
  <article>
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
