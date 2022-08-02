<script>
  import { Title, Navigation, Router } from "../../stores/Navigation";
  import Fa from "svelte-fa";
  import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
  import { StatusBar } from "../../stores/Setup";
  import { Views, Types } from "@ikomida/components";
  import { newTerm, editTerm } from "../../network/Terms";
  import { onMount } from "svelte";

  let { item, edit } = $Router.options;
  let isLoading = false;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }
  let selectedTermType = null;
  let oldSelectedTermType = null;

  onMount(() => {    
    selectedTermType = Types.TermTypes.list.filter(
      (option) => option.id == item?.type
    )?.[0];
    oldSelectedTermType = selectedTermType;
  });
  $: if (
    selectedTermType &&
    (oldSelectedTermType === null ||
      oldSelectedTermType?.id !== selectedTermType?.id)
  ) {
    item.type = selectedTermType?.id;
    oldSelectedTermType = selectedTermType;
  }

  const submit = async () => {
    if (item.name === null || item.name.length < 2) {
      toggleErrorAlert("Nome deve ter mais que 3 carateres");
      return;
    } else if (item.text === null || item.text === "") {
      toggleErrorAlert("Precisa digitar um texto");
      return;
    } else if (item.type === null || item.type === "") {
      toggleErrorAlert("Precisa escolher um tipo");
      return;
    }
    isLoading = true;
    let response;
    if (edit) {
      response = await editTerm(item);
    } else {
      response = await newTerm(item);
    }
    if (response.success) {
      Navigation.pop();
    } else {
      toggleErrorAlert(response?.data);
      isLoading = false;
      return;
    }
    isLoading = false;
  };
  Title.set("Nova termo");
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
    type="name"
    placeHolder="Nome"
    bind:value={item.name}
    initialValue={item.name}
  />
  <Views.Selector
    bind:selected={selectedTermType}
    name="selecione uma opção"
    options={Types.TermTypes.list}
  />
  <Views.TextEdit
    type="text"
    placeHolder="HTML"
    bind:value={item.text}
    initialValue={item.text}
  />
  <Views.Switch name="Ativo:" bind:checked={item.active} />
  <Views.Divider />
  <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
  >
  <Views.MessageAlert object={errorAlert} bind:show={showAlert} />
</div>

<style>
</style>
