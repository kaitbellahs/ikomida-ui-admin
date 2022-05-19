<script>
  import { Title, Navigation, Router } from "../stores/Navigation";
  import Fa from "svelte-fa";
  import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
  import { StatusBar } from "../stores/Setup";
  import { Views, Types } from "@ikomida/components";
  import { newPlan, editPlan } from "../network/Plans";

  let { item, edit } = $Router.options;
  let isLoading = false;
  let errorAlert;
  let showAlert = false;
  let selectedDiscountType;
  let oldSelectedDiscountType = null;
  $: if (
    selectedDiscountType &&
    (oldSelectedDiscountType === null ||
      oldSelectedDiscountType?.id !== selectedDiscountType?.id)
  ) {
    item.discountType = selectedDiscountType?.id;
    item.discount = 0;
    oldSelectedDiscountType = selectedDiscountType;
  }

  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }

  const addDetail = () => {
    item?.details?.push({ key: null, value: null });
    item.details = item?.details;
  };

  const submit = async () => {
    isLoading = true;
    let response;
    if (edit) {
      response = await editPlan(item);
    } else {
      response = await newPlan(item);
    }
    if (response.success) {
      Navigation.pop();
    } else {
      toggleErrorAlert(response?.data);
    }
    isLoading = false;
  };
  Title.set("Novo plano");
</script>

{#if isLoading}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{/if}
<div class="plan">
  <h2>Dados do plano</h2>
  <Views.TextEdit name="Nome:" bind:value={item.name} placeHolder="" />
  <Views.TextEdit
    name="preço:"
    type="currency"
    bind:value={item.price}
    placeHolder=""
  />
  <Views.Switch name="Destacado:" bind:checked={item.highlighted} />
  <Views.Selector
    bind:selected={selectedDiscountType}
    name="seleciona uma opção"
    options={Types.DiscountTypes.list}
  />
  {#if selectedDiscountType}
    {#if selectedDiscountType.name === Types.DiscountTypes.PERCENT}
      <Views.TextEdit
        type="percent"
        name="Valor:"
        bind:value={item.discount}
        placeHolder=""
      />
    {:else if selectedDiscountType.name === Types.DiscountTypes.VALUE}
      <Views.TextEdit
        name="Valor:"
        bind:value={item.discount}
        type="currency"
        placeHolder=""
      />
    {/if}
  {/if}
  <h2>Detalhes do plano</h2>
  {#each item?.details as detail}
    <div class="twoCells">
      <Views.TextEdit name="key:" bind:value={detail.key} placeHolder="" />
      <Views.TextEdit name="value:" bind:value={detail.value} placeHolder="" />
    </div>
  {/each}
  <Views.Divider />
  <Views.Button on:click={addDetail}
    ><Fa icon={faEdit} /><span>Addicionar detalhes</span></Views.Button
  >
  <Views.Divider />
  <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /><span>Salvar</span></Views.Button
  >
  <Views.MessageAlert object={errorAlert} bind:show={showAlert} />
</div>

<style>
  .twoCells {
    display: flex;
  }
  .twoCells > div {
    border: 1px solid blue;
    flex: 1;
    margin: 1em;
  }
</style>
