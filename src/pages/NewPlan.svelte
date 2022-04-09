<script>
    import { Title, Navigation } from "../stores/Navigation";
    import Fa from "svelte-fa";
    import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
    import { StatusBar } from "../stores/Setup";
    import { Views } from "@tian/components";
    import { newPlan } from "../network/Plans";
  
    let item = {
      name: null,
      price: null
    };
    let isLoading = false;
    let errorAlert;
    let showAlert = false;
    function toggleErrorAlert(messageObject) {
      errorAlert = messageObject;
      showAlert = true;
    }
  
    const submit = async () => {
      isLoading = true;
      let response = await newPlan(item);
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
      type='currency'
      bind:value={item.price}
      placeHolder=""
    />
    <Views.Divider />
    <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
      ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
    >
    <Views.MessageAlert object={errorAlert} bind:show={showAlert} />
  </div>
  
  <style>
  </style>
  