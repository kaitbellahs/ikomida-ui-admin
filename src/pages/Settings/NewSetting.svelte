<script>
  import Fa from "svelte-fa";
  import { faEdit } from "@fortawesome/free-solid-svg-icons";
  import { StatusBar } from "../../stores/Setup";
  import { Views, Stores } from "@ikomida/components";
  import { newSetting, editSetting } from "../../network/Settings";
  import SettingTypes from "../../types/SettingTypes";
  import { onMount } from "svelte";

  const router = Stores.Navigation.instance.router;
  const { item, edit } = $router.options;
  let isLoading = true;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }
  let selectedSettingType = null;
  let oldSelectedSettingType = null;

  onMount(() => {
    oldSelectedSettingType = SettingTypes.list.filter(
      (option) => option.id == item.type
    )?.[0];
    selectedSettingType = oldSelectedSettingType;
    isLoading = false;
  });
  $: if (
    selectedSettingType &&
    (oldSelectedSettingType === null ||
      oldSelectedSettingType?.id !== selectedSettingType?.id)
  ) {
    item.type = selectedSettingType?.id;
    if (
      selectedSettingType.name === SettingTypes.TEXT ||
      selectedSettingType.name === SettingTypes.LIST
    ) {
      item.value = "";
    } else if (selectedSettingType.name === SettingTypes.BOOL) {
      item.value = true;
    } else if (
      selectedSettingType.name === SettingTypes.NUMBER ||
      selectedSettingType.name === SettingTypes.CURRENCY
    ) {
      item.value = 0;
    }
    oldSelectedSettingType = selectedSettingType;
  }

  const submit = async () => {
    if (item.name === null || item.name.length < 2) {
      toggleErrorAlert("Nome deve ter mais que 3 carateres");
      return;
    } else if (item.type === null || item.type === "") {
      toggleErrorAlert("Precisa escolher um tipo");
      return;
    }
    isLoading = true;
    let response;
    if (edit) {
      response = await editSetting(item);
    } else {
      response = await newSetting(item);
    }
    if (response.success) {
      Stores.Navigation.instance.pop();
    } else {
      toggleErrorAlert(response?.data);
      isLoading = false;
      return;
    }
    isLoading = false;
  };
  Stores.Title.instance.set("Nova configuração");
</script>

{#if isLoading}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{/if}
<div class="setting">
  <h2>Dados</h2>
  <Views.TextEdit
    type="alphanumeric"
    placeHolder="Nome"
    bind:value={item.name}
    initialValue={item.name}
  />
  <Views.Selector
    bind:selected={selectedSettingType}
    name="selecione uma opção"
    options={SettingTypes.list}
  />
  {#if selectedSettingType}
    {#if selectedSettingType.name === SettingTypes.TEXT || selectedSettingType.name === SettingTypes.LIST}
      <Views.TextEdit
        type="text"
        placeHolder="Valor"
        bind:value={item.value}
        initialValue={item.value}
      />
    {:else if selectedSettingType.name === SettingTypes.BOOL}
      <Views.Switch name="Valor" bind:checked={item.value} />
    {:else if selectedSettingType.name === SettingTypes.NUMBER}
      <Views.TextEdit
        placeHolder="Valor"
        bind:value={item.value}
        initialValue={item.value}
        type="number"
      />
    {:else if selectedSettingType.name === SettingTypes.CURRENCY}
      <Views.TextEdit
        placeHolder="Valor"
        bind:value={item.value}
        initialValue={item.value}
        type="currency"
      />
    {/if}
  {/if}
  <Views.Divider />
  <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
  >
  <Views.MessageAlert object={errorAlert} bind:show={showAlert} />
</div>

<style>
</style>
