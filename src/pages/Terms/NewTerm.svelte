<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'
  import { StatusBar } from '../../stores/Setup'
  import { Views, Types, Stores, Network } from '@ikomida/shared-frontend'
  import { newTerm, editTerm } from '../../network/Terms'
  import { onMount } from 'svelte'

  const router = Stores.Navigation.instance.router
  const { item, edit } = $router.options
  let selectedTermType: Types.Types.TTerm | undefined = undefined
  let oldSelectedTermType: Types.Types.TTerm | undefined = undefined

  onMount(() => {
    selectedTermType = Types.Types.TTerm.values().filter(option => option.id == item?.type)?.[0]
    oldSelectedTermType = selectedTermType
    Stores.Loading.instance.stop()
  })
  $: if (selectedTermType && (oldSelectedTermType === null || oldSelectedTermType?.id !== selectedTermType?.id)) {
    item.type = selectedTermType?.id
    oldSelectedTermType = selectedTermType
  }

  const submit = async () => {
    if (item.name === null || item.name.length < 2) {
      Stores.MessageAlert.instance.show('Nome deve ter mais que 3 carateres')
      return
    } else if (item.text === null || item.text === '') {
      Stores.MessageAlert.instance.show('Precisa digitar um texto')
      return
    } else if (item.type === null || item.type === '') {
      Stores.MessageAlert.instance.show('Precisa escolher um tipo')
      return
    }
    Stores.Loading.instance.start()
    let response
    if (edit) {
      response = await editTerm(item)
    } else {
      response = await newTerm(item)
    }
    if (response.success) {
      Network.instance?.clearCache(Stores.Cache.Types.TERMS)
      Stores.Navigation.instance.pop()
    } else {
      Stores.MessageAlert.instance.show(response?.data)
      Stores.Loading.instance.stop()
      return
    }
    Stores.Loading.instance.stop()
  }
  Stores.Title.instance.set('Nova termo')
</script>

<div class="setting">
  <h2>Dados</h2>
  <Views.TextEdit type={Types.TTextEdit.NAME} placeHolder="Nome" bind:value={item.name} initialValue={item.name} />
  <Views.Selector bind:selected={selectedTermType} name="selecione uma opção" options={Types.Types.TTerm.values()} />
  <Views.TextEdit type={Types.TTextEdit.TEXT} placeHolder="HTML" bind:value={item.text} initialValue={item.text} />
  <Views.Switch name="Ativo:" bind:checked={item.active} />
  <Views.Divider />
  <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
  >
</div>

<style>
</style>
