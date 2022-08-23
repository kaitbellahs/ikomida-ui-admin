<script>
  import * as AuthNetwork from "../network/Auth";
  import { Views } from "@ikomida/components";
  import { faPhone, faUnlock } from "@fortawesome/free-solid-svg-icons";
  import { Utils, Stores } from "@ikomida/components";
  import { onMount } from "svelte";

  let isLoading = true;
  let phone;
  let password;
  let validPhone = false;
  let validPassword = false;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }

  $: canLogin = validPhone && validPassword;

  async function doLogin() {
    isLoading = true;
    const response = await AuthNetwork.doLogin(55, phone, password);
    if (response?.success) {
      const token = await Utils.Jws.extractToken(response?.data);
      if (token !== null) {
        Stores.Auth.instance.setToken(response?.data);
      } else {
        toggleErrorAlert("Token não é valido");
      }
    } else {
      toggleErrorAlert(response?.data);
    }
    isLoading = false;
  }
  onMount(() => {
    isLoading = false;
  });
</script>

{#if isLoading}
  <Views.Loading />
{/if}
<main>
  <div class="avatar">
    <img src="/assets/Icons/transparent-logo-1.svg" alt="iKomida" />
  </div>
  <h1>Login</h1>
  <small
    >Esta é uma área restrita para pessoas autorizadas, se você recebeu este app
    e você não está dentre essas pessoas entre em contato conosco.</small
  >
  <Views.TextEdit
    bind:value={phone}
    initialValue={phone}
    icon={faPhone}
    type="phone"
    error="insira um número de telefone válido."
    placeHolder="Número de celular"
    bind:isValid={validPhone}
  />
  <Views.TextEdit
    bind:value={password}
    initialValue={password}
    icon={faUnlock}
    placeHolder="Senha"
    secret={true}
    error="A senha deve ter um tamanho entre 8 e 40 caracteres e contendo no mínimo
    uma letra maiúscula, uma letra minúscula, um número e um símbolo."
    bind:isValid={validPassword}
    type="password"
  />
  <div />
  <Views.Button on:click={doLogin} disabled={!canLogin}>Entrar</Views.Button>
  <Views.GTerms />
  <Views.MessageAlert object={errorAlert} bind:show={showAlert} />
</main>

<style>
  main {
    align-items: center;
    place-content: center;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 100;
    margin: 0;
  }
  main > div {
    margin-bottom: 30px;
  }
  .avatar {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .avatar > img {
    font-size: 3em;
    width: 100%;
    max-width: 100%;
    border-radius: 45px;
    line-height: 90px;
    vertical-align: middle;
    display: table-cell;
    overflow: hidden;
  }
</style>
