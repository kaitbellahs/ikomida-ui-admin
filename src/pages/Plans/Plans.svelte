<script>
  import Routes from "../../stores/Routes";
  import { removePlan, activatePlan } from "../../network/Plans";
  import { Views, Utils, Stores } from "@ikomida/components";

  import { StatusBar } from "../../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit, faSync } from "@fortawesome/free-solid-svg-icons";

  onMount(async () => {
    Stores.Loading.instance.stop();
  });

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
        support: [],
      },
      edit: false,
    });
  }

  async function onRemoveClick(id) {
    Stores.Loading.instance.start();
    let response = await removePlan(id);
    if (response.success) {
      plans = await getPlans();
    } else {
      Stores.MessageAlert.instance.show(response?.data);
      Stores.Loading.instance.stop();
      return;
    }
    Stores.Loading.instance.stop();
  }
  async function onActivateClick(id, event) {
    const checked = event.detail?.checked;

    Stores.Loading.instance.start();
    let response = await activatePlan({
      id,
      active: !checked,
    });
    if (response && response?.success) {
      plans = await getPlans();
    } else {
      Stores.Loading.instance.stop();
      Stores.MessageAlert.instance.show(response?.data);
      plans = plans.map((plan) => {
        if (plan?.id === id) {
          plan.active = checked;
        }
        return plan;
      });
    }
    Stores.Loading.instance.stop();
  }
  Stores.Title.instance.set("Planos");
</script>

<Views.Button on:click={newPlan} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Novo plano</span></Views.Button
>
<Views.LoadMore
  noItems="Não há planos para exibir!"
  cache={Stores.Cache.Types.PLANS}
  url="/admin/plans"
  let:item
>
  <article>
    <h2>{item.name}</h2>
    <div>price: {Utils.Strings.currency(item.price)}</div>
    <div>Data: {Utils.Strings.dateToDateString(item.createdAt)}</div>
    <!-- <Views.Switch
      name="Ativo:"
      bind:checked={item.active}
      on:check={(event) => onActivateClick(item.id, event)}
    /> -->
  </article>
</Views.LoadMore>

<style>
  article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
  }
</style>
