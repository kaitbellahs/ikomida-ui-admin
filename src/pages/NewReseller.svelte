<script>
  import { Title, Navigation } from "../stores/Navigation";
  import Fa from "svelte-fa";
  import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
  import { StatusBar } from "../stores/Setup";
  import { Views } from "@ikomida/components";
  import { newReseller, GetAddressByCep } from "../network/Resellers";

  let item = {
    name: null,
    lastName: null,
    cpf: null,
    areaCode: 55,
    phone: null,
    email: null,
    password: null,
    address: {
      postalCode: null,
      address: null,
      number: null,
      complement: null,
      neighborhood: null,
      city: null,
      stat: null,
      country: null,
    },
  };
  let isLoading = false;
  let currentPostalCode = null;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }

  $: if (
    (item?.address?.postalCode?.length || 0) === 8 &&
    item?.address?.postalCode != currentPostalCode
  ) {
    findAddress();
  }
  function findAddress() {
    isLoading = true;
    currentPostalCode = item?.address?.postalCode;
    GetAddressByCep(item.address.postalCode)
      .then((response) => {
        if (response?.success) {
          const address = response?.data;
          currentPostalCode = address?.postalCode;
          item.address = { ...item?.address, ...address };
        } else {
          toggleErrorAlert(response?.data);
        }
        isLoading = false;
      })
      .catch((exception) => {
        toggleErrorAlert(exception);
      });
  }

  const submit = async () => {
    isLoading = true;
    let response = await newReseller(item);
    if (response.success) {
      Navigation.pop();
    } else {
      toggleErrorAlert(response?.data);
    }
    isLoading = false;
  };
  Title.set("Novo vendedor");
</script>

{#if isLoading}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{/if}
<div class="reseller">
  <h2>Dados pessoais</h2>
  <Views.TextEdit name="Nome:" bind:value={item.name} placeHolder="" />
  <Views.TextEdit
    name="Sobre nome:"
    bind:value={item.lastName}
    placeHolder=""
  />
  <Views.TextEdit name="Email:" bind:value={item.email} placeHolder="" />
  <Views.TextEdit name="Telefone:" bind:value={item.phone} placeHolder="" />
  <Views.TextEdit name="CPF:" type="cpf" bind:value={item.cpf} placeHolder="" />
  <Views.TextEdit
    name="Senha:"
    secret={true}
    bind:value={item.password}
    placeHolder=""
  />
  <small
    >A senha deve ter um tamanho entre 8 e 40 caracteres e contendo no mínimo
    uma letra maiúscula, uma letra minúscula, um número e um símbolo</small
  >
  <Views.Divider />
  <h2>Endereço</h2>
  <Views.TextEdit
    mask="_____-___"
    maskKey="_"
    type="number"
    callback={findAddress}
    buttonIcon={faSearch}
    bind:rawValue={item.address.postalCode}
    placeHolder="CEP"
  />
  <Views.TextEdit placeHolder="Endereço" bind:value={item.address.street} />
  <Views.TextEdit placeHolder="Numero" bind:value={item.address.number} />
  <Views.TextEdit
    placeHolder="Complemento"
    bind:value={item.address.complement}
  />
  <Views.TextEdit placeHolder="Bairro" bind:value={item.address.neighborhood} />
  <Views.TextEdit placeHolder="Cidade" bind:value={item.address.city} />
  <Views.TextEdit placeHolder="UF" bind:value={item.address.stat} />
  <Views.Divider />
  <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
  >
  <Views.MessageAlert object={errorAlert} bind:show={showAlert} />
</div>

<style>
</style>
