<script>
  import { Title, Navigation, Routes } from "../stores/Navigation";
  import { getPlans, removePlan, activatePlan } from "../network/Plans";
  import { Views, Utils } from "@ikomida/components";
  import { StatusBar } from "../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
  let plans;
  let isLoading = false;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }
  onMount(async () => {
    plans = await getPlans();
  });
  async function newPlan() {
    Navigation.goTo(Routes.newPlan, {
      item: {
        name: null,
        price: null,
        discount: null,
        discountType: null,
        details: [],
        highlighted: false,
      },
      edit: false,
    });
  }
  async function editSetting(item) {
    Navigation.goTo(Routes.newPlan, {
      item,
      edit: true,
    });
  }
  async function onRemoveClick(id) {
    isLoading = true;
    let response = await removePlan(id);
    if (response.success) {
      plans = await getPlans();
    } else {
      toggleErrorAlert(response?.data);
      isLoading = false;
      return;
    }
    isLoading = false;
  }
  async function onActivateClick(id, event) {
    const checked = event.detail?.checked;

    isLoading = true;
    let response = await activatePlan({
      id,
      active: !checked,
    });
    if (response && response?.success) {
      plans = await getPlans();
    } else {
      isLoading = false;
      toggleErrorAlert(response?.data);
      plans = plans.map((plan) => {
        if (plan?.id === id) {
          plan.active = checked;
        }
        return plan;
      });
    }
    isLoading = false;
  }
  Title.set("Planos");
</script>

<Views.Button on:click={newPlan} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Novo plano</span></Views.Button
>
<Views.Divider />
{#if plans}
  <section>
    {#if plans.length > 0}
      {#each plans as plan}
        <article>
          <span on:click={onRemoveClick(plan.id)} class="remove"
            ><Fa icon={faTrashAlt} /></span
          >
          <span on:click={editSetting(plan)} class="edit"
            ><Fa icon={faEdit} /></span
          >
          <h2>{plan.name}</h2>
          <div>price: {Utils.Strings.currency(plan.price)}</div>
          <div>Data: {Utils.Strings.dateToDateString(plan.createdAt)}</div>
          <Views.Switch
            name="Ativo:"
            bind:checked={plan.active}
            on:checked={(event) => onActivateClick(plan.id, event)}
          />
        </article>
      {/each}
    {:else}
      Não há planos para exibir!
    {/if}
  </section>
{/if}

{#if isLoading || !plans}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{/if}

<Views.MessageAlert object={errorAlert} bind:show={showAlert} />

<style>
  section > article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
  }
  .remove {
    position: absolute;
    top: -8px;
    right: -10px;
    font-size: 1.3em;
    color: white;
    font-family: RobotoBold;
    border: 1px solid #4c0708;
    background: #4c0708;
    border-radius: 20px;
    width: 26px;
    height: 26px;
    vertical-align: middle;
    text-align: center;
    padding: 6px;
  }
  .edit {
    position: absolute;
    top: -8px;
    right: 35px;
    font-size: 0.9em;
    color: white;
    font-family: RobotoBold;
    border: 1px solid #4c0708;
    background: #4c0708;
    border-radius: 20px;
    width: 25px;
    height: 25px;
    vertical-align: middle;
    text-align: center;
    padding: 6px;
  }
</style>
