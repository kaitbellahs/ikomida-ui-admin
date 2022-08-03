<script>
  import { Title, Navigation, Router } from "../../stores/Navigation";
  import Fa from "svelte-fa";
  import { faEdit } from "@fortawesome/free-solid-svg-icons";
  import { StatusBar } from "../../stores/Setup";
  import { Views, Types } from "@ikomida/components";
  import { newPlan, editPlan } from "../../network/Plans";
  import { onMount } from "svelte";

  let { item, edit } = $Router.options;
  let isLoading = false;
  let errorAlert;
  let showAlert = false;
  let selectedDiscountType;
  let oldSelectedDiscountType = null;
  let discountTypeInput = null;

  $: if (
    selectedDiscountType &&
    (oldSelectedDiscountType === null ||
      oldSelectedDiscountType?.id !== selectedDiscountType?.id)
  ) {
    item.discountType = selectedDiscountType?.id;
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
  onMount(() => {
    selectedDiscountType = Types.DiscountTypes.list.filter(
      (type) => type.id === item.discountType
    )?.[0];
  });
  Title.set(edit ? "Editar plano" : "Novo plano");
</script>

{#if isLoading}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{/if}
<div class="plan">
  <h2>Dados do plano</h2>
  <Views.TextEdit
    placeHolder="Orden de exibição"
    type="number"
    bind:value={item.order}
    initialValue={item.order}
  />
  <Views.TextEdit
    placeHolder="Nome"
    bind:value={item.name}
    initialValue={item.name}
  />
  <Views.TextEdit
    placeHolder="preço"
    type="currency"
    bind:value={item.price}
    initialValue={item.price}
  />
  <Views.Switch placeHolder="Destacado" bind:checked={item.highlighted} />
  <Views.Selector
    bind:selected={selectedDiscountType}
    name="selecione uma opção"
    options={Types.DiscountTypes.list}
  />
  {#if selectedDiscountType}
    {#if selectedDiscountType.name === Types.DiscountTypes.PERCENT}
      <Views.TextEdit
        type="percent"
        placeHolder="Valor"
        bind:value={item.discount}
        initialValue={item.discount}
      />
    {:else if selectedDiscountType.name === Types.DiscountTypes.VALUE}
      <Views.TextEdit
        placeHolder="Valor"
        bind:value={item.discount}
        initialValue={item.discount}
        type="currency"
      />
    {/if}
  {/if}
  <h2>Detalhes do plano</h2>
  <Views.TextEdit
    placeHolder="Faturamento"
    type="currency"
    bind:value={item.billing}
    initialValue={item.billing}
  />
  <Views.TextEdit
    placeHolder="Colaboradores"
    type="number"
    bind:value={item.staff}
    initialValue={item.staff}
  />
  <Views.TextEdit
    placeHolder="Produtos"
    type="number"
    bind:value={item.products}
    initialValue={item.products}
  />
  <Views.TextEdit
    placeHolder="Pedidos"
    type="number"
    bind:value={item.orders}
    initialValue={item.orders}
  />
  <Views.TextEdit
    placeHolder="Couons"
    type="number"
    bind:value={item.coupons}
    initialValue={item.coupons}
  />

  <h3>Meios de suporte</h3>
  <div class="supports">
    {#each Types.SupportTypes.list as support}
      <div class="support">
        <Views.Checkbox
          marginTop="0"
          checked={item?.support?.includes(support?.id)}
          on:check={(event) => {
            const index = item?.support?.indexOf(support?.id);
            if ((index ?? -1) > -1) {
              item?.support?.splice(index, 1);
            }
            if (!event?.detail?.checked) {
              item?.support?.push(support?.id);
            }
          }}
          label={support.name}
        />
      </div>
    {/each}
  </div>
  {#each item?.details as detail}
    <div class="twoCells">
      <Views.TextEdit
        placeHolder="key"
        bind:value={detail.key}
        initialValue={detail.key}
      />
      <Views.TextEdit
        placeHolder="value"
        bind:value={detail.value}
        initialValue={detail.value}
      />
    </div>
  {/each}
  <Views.Divider />
  <Views.Button on:click={addDetail}
    ><Fa icon={faEdit} /><span>Adicionar detalhes</span></Views.Button
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
  .plan > .supports {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .plan > .supports > .support {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 5px;
    width: 50%;
    display: flex;
    flex-direction: column;
    flex-basis: 40%;
    text-shadow: 0.5px 1px #18056b66;
    box-shadow: 1px 1.5px #00000099;
  }
</style>
