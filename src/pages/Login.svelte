<script>
  import { Auth } from "../stores/Auth";
  import * as AuthNetwork from "../network/Auth";
  import { Views } from "@ikomida/components";
  import { faPhone, faUnlock } from "@fortawesome/free-solid-svg-icons";
  import { Utils } from "@ikomida/components";

  let isLoading = false;
  let phone ;
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
        Auth.setToken(response?.data);
      } else {
        toggleErrorAlert("Token não é valido");
      }
    } else {
      toggleErrorAlert(response?.data);
    }
    isLoading = false;
  }
</script>

{#if isLoading}
  <Views.Loading />
{/if}
<main>
  <h1>Login!</h1>
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
    text-align: center;
    padding: 1em;
    min-width: 90%;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  main > p,
  main > div {
    margin-bottom: 30px;
  }
</style>
