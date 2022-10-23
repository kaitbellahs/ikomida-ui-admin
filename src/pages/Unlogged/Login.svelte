<script lang="ts">
  import * as AuthNetwork from '../../network/Auth'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { faPhone, faUnlock } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import Routes from '../../stores/Routes'

  let phone: string
  let password: string
  let validPhone = false
  let validPassword = false

  $: canLogin = validPhone && validPassword

  async function forgotPassword() {
    Stores.Navigation.instance.goTo(Routes.forgotPassword)
  }

  async function doLogin() {
    Stores.Loading.instance.start()
    const response = await AuthNetwork.doLogin('55', phone, password)
    if (response?.success) {
      const token = await Utils.Jws.extractToken(response?.data)
      if (token !== null) {
        await Stores.Auth.Auth.instance.setToken(response?.data)
      } else {
        Stores.MessageAlert.instance.show('Token não é valido')
      }
    } else {
      Stores.MessageAlert.instance.show(response?.data)
    }
    Stores.Loading.instance.stop()
  }

  onMount(() => {
    Stores.Loading.instance.stop()
  })
</script>

<main>
  <div class="avatar">
    <Views.Image source="/assets/Icons/transparent-logo-1.svg" name="iKomida" />
  </div>
  <h1>Login</h1>
  <small
    >Esta é uma área restrita para pessoas autorizadas, se você recebeu este app e você não está dentre essas pessoas
    entre em contato conosco.</small
  >
  <Views.TextEdit
    bind:value={phone}
    initialValue={phone}
    icon={faPhone}
    type={Types.TTextEdit.PHONE}
    error="insira um número de telefone válido."
    placeHolder="Número de celular"
    bind:isValid={validPhone}
  />
  <Views.TextEdit
    bind:value={password}
    initialValue={password}
    icon={faUnlock}
    placeHolder="Senha"
    error="A senha deve ter um tamanho entre 8 e 40 caracteres e contendo no mínimo
    uma letra maiúscula, uma letra minúscula, um número e um símbolo."
    bind:isValid={validPassword}
    type={Types.TTextEdit.PASSWORD}
  />
  <div />
  <Views.Button on:click={doLogin} disabled={!canLogin}>Entrar</Views.Button>
  <Views.Button type={Types.TButton.TRANSPARENT} on:click={forgotPassword}>Recuperar a senha</Views.Button>
  <Views.GTerms />
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
  .avatar > :global(img) {
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
