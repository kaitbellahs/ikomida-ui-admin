<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEdit, faSearch } from '@fortawesome/free-solid-svg-icons'
  import { StatusBar } from '../../stores/Setup'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'
  import { newReseller, GetAddressByCep } from '../../network/Resellers'
  import { onMount } from 'svelte'

  interface IItemInputs {
    name: Views.TextEdit | null
    lastName: Views.TextEdit | null
    identity: Views.TextEdit | null
    phone: Views.TextEdit | null
    email: Views.TextEdit | null
    address: {
      postalCode: Views.TextEdit | null
      street: Views.TextEdit | null
      number: Views.TextEdit | null
      complement: Views.TextEdit | null
      neighborhood: Views.TextEdit | null
      city: Views.TextEdit | null
      stat: Views.TextEdit | null
    }
  }

  let item = Types.Classes.CUser.fromObject({
    name: null,
    lastName: null,
    identity: null,
    areaCode: 55,
    phone: null,
    email: null,
    address: {
      postalCode: null,
      street: null,
      number: null,
      complement: null,
      neighborhood: null,
      city: null,
      stat: null
    }
  })
  let itemInputs: IItemInputs = {
    name: null,
    lastName: null,
    identity: null,
    phone: null,
    email: null,
    address: {
      postalCode: null,
      street: null,
      number: null,
      complement: null,
      neighborhood: null,
      city: null,
      stat: null
    }
  }
  let itemValidation = {
    name: false,
    lastName: false,
    identity: false,
    phone: false,
    email: false,
    address: {
      postalCode: false,
      street: false,
      number: false,
      neighborhood: false,
      city: false,
      stat: false
    }
  }
  let currentPostalCode: string | undefined = undefined

  $: canProceed = Utils.Objects.validateFields(itemValidation)
  $: if ((item.address?.postalCode?.length ?? 0) === 8 && item?.address?.postalCode != currentPostalCode) {
    findAddress()
  }

  function findAddress() {
    Stores.Loading.instance.start()
    currentPostalCode = item?.address?.postalCode
    GetAddressByCep(item.address.postalCode)
      .then(response => {
        if (response?.success) {
          const address = response?.data
          currentPostalCode = address?.postalCode
          item.address = { ...item?.address, ...address }
          Utils.Objects.updateInputs(itemInputs.address, item.address)
        } else {
          Stores.MessageAlert.instance.show(response?.data)
        }
        Stores.Loading.instance.stop()
      })
      .catch(exception => {
        Stores.MessageAlert.instance.show(exception)
      })
  }

  const submit = async () => {
    if (!Utils.Objects.validateFields(itemValidation)) {
      Stores.MessageAlert.instance.show('Por favor preenche os dados do formulario corretamente')
      return
    }
    Stores.Loading.instance.start()
    let response = await newReseller(item)
    if (response.success) {
      Stores.Navigation.instance.pop()
    } else {
      Stores.MessageAlert.instance.show(response?.data)
    }
    Stores.Loading.instance.stop()
  }
  onMount(() => {
    Stores.Loading.instance.stop()
  })
  Stores.Title.instance.set('Novo vendedor')
</script>

<div class="reseller">
  <h2>Dados pessoais</h2>
  <Views.TextEdit
    placeHolder="Nome"
    bind:value={item.name}
    bind:this={itemInputs.name}
    bind:isValid={itemValidation.name}
    type={Types.TTextEdit.NAME}
    min={2}
    max={255}
  />
  <Views.TextEdit
    placeHolder="Sobre nome"
    bind:value={item.lastName}
    bind:this={itemInputs.lastName}
    bind:isValid={itemValidation.lastName}
    type={Types.TTextEdit.NAME}
    min={2}
    max={255}
  />
  <Views.TextEdit
    placeHolder="Email"
    bind:value={item.email}
    bind:isValid={itemValidation.email}
    bind:this={itemInputs.email}
    type={Types.TTextEdit.EMAIL}
  />
  <Views.TextEdit
    bind:value={item.phone}
    bind:this={itemInputs.phone}
    bind:isValid={itemValidation.phone}
    type={Types.TTextEdit.PHONE}
    placeHolder="Número de celular"
  />
  <Views.TextEdit
    placeHolder="CPF"
    type={Types.TTextEdit.CPF}
    bind:value={item.identity}
    bind:this={itemInputs.identity}
    bind:isValid={itemValidation.identity}
  />
  <Views.Divider />
  <h2>Endereço</h2>
  <Views.TextEdit
    type={Types.TTextEdit.CEP}
    callback={findAddress}
    buttonIcon={faSearch}
    bind:value={item.address.postalCode}
    bind:this={itemInputs.address.postalCode}
    bind:isValid={itemValidation.address.postalCode}
    placeHolder="CEP"
  />
  <Views.TextEdit
    placeHolder="Endereço"
    bind:value={item.address.street}
    bind:this={itemInputs.address.street}
    bind:isValid={itemValidation.address.street}
    min={2}
    max={255}
  />
  <Views.TextEdit
    placeHolder="Número"
    bind:value={item.address.number}
    bind:this={itemInputs.address.number}
    bind:isValid={itemValidation.address.number}
    min={1}
    max={255}
    empty={!itemValidation.address.postalCode}
  />
  <Views.TextEdit
    placeHolder="Complemento"
    bind:value={item.address.complement}
    bind:this={itemInputs.address.complement}
  />
  <Views.TextEdit
    placeHolder="Bairro"
    bind:value={item.address.neighborhood}
    bind:isValid={itemValidation.address.neighborhood}
    bind:this={itemInputs.address.neighborhood}
    min={2}
    max={255}
  />
  <Views.TextEdit
    placeHolder="Cidade"
    bind:value={item.address.city}
    bind:isValid={itemValidation.address.city}
    bind:this={itemInputs.address.city}
    min={2}
    max={255}
  />
  <Views.TextEdit
    placeHolder="UF"
    bind:value={item.address.stat}
    bind:this={itemInputs.address.stat}
    bind:isValid={itemValidation.address.stat}
    min={2}
    max={2}
  />
  <Views.Divider />
  <small
    >Certifique se de que o vendedor que você está adicionando na plataforma tem sua própria vontade para participar
    neste programa de vendas, e ao clicar no botão “ADICIONAR” você se responsabiliza em orientar o vendedor de como usa
    a plataforma e explicar o nosso programa de vendas tampouco o funcionamento da plataforma e disponibilizar links de
    acesso à documentação e vídeos se houver. Ao clicar no botão “ADICIONAR” você declara sob penas da lei que os dados
    preenchidos são verdadeiros.</small
  >
  <Views.Divider />

  <Views.Button disabled={!canProceed} on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
  >
</div>

<style>
</style>
