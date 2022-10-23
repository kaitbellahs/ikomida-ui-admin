<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'
  import { StatusBar } from '../../stores/Setup'
  import { Views, Stores, Types } from '@ikomida/shared-frontend'
  import { newSetting, editSetting } from '../../network/Settings'
  import SettingTypes from '../../types/SettingTypes'
  import { onMount } from 'svelte'

  const router = Stores.Navigation.instance.router
  const { item, edit } = $router.options
  let selectedSettingType: SettingTypes | undefined = undefined
  let oldSelectedSettingType: SettingTypes | undefined = undefined

  onMount(() => {
    oldSelectedSettingType = SettingTypes.values().filter(option => option.id == item.type)?.[0]
    selectedSettingType = oldSelectedSettingType
    Stores.Loading.instance.stop()
  })
  $: if (
    selectedSettingType &&
    (oldSelectedSettingType === null || oldSelectedSettingType?.id !== selectedSettingType?.id)
  ) {
    item.type = selectedSettingType?.id
    if (selectedSettingType === SettingTypes.TEXT || selectedSettingType === SettingTypes.LIST) {
      item.value = ''
    } else if (selectedSettingType === SettingTypes.BOOL) {
      item.value = true
    } else if (selectedSettingType === SettingTypes.NUMBER || selectedSettingType === SettingTypes.CURRENCY) {
      item.value = 0
    }
    oldSelectedSettingType = selectedSettingType
  }

  const submit = async () => {
    if (item.name === null || item.name.length < 2) {
      Stores.MessageAlert.instance.show('Nome deve ter mais que 3 carateres')
      return
    } else if (item.type === null || item.type === '') {
      Stores.MessageAlert.instance.show('Precisa escolher um tipo')
      return
    }
    Stores.Loading.instance.start()
    let response
    if (edit) {
      response = await editSetting(item)
    } else {
      response = await newSetting(item)
    }
    if (response.success) {
      Stores.Navigation.instance.pop()
    } else {
      Stores.MessageAlert.instance.show(response?.data)
      Stores.Loading.instance.stop()
      return
    }
    Stores.Loading.instance.stop()
  }
  Stores.Title.instance.set('Nova configuração')
</script>

<div class="setting">
  <h2>Dados</h2>
  <Views.TextEdit
    type={Types.TTextEdit.ALPHA_NUMERIC}
    placeHolder="Nome"
    bind:value={item.name}
    initialValue={item.name}
  />
  <Views.Selector bind:selected={selectedSettingType} name="selecione uma opção" options={SettingTypes.values()} />
  {#if selectedSettingType}
    {#if selectedSettingType && (selectedSettingType === SettingTypes.TEXT || selectedSettingType === SettingTypes.LIST)}
      <Views.TextEdit
        type={Types.TTextEdit.TEXT}
        placeHolder="Valor"
        bind:value={item.value}
        initialValue={item.value}
      />
    {:else if selectedSettingType === SettingTypes.BOOL}
      <Views.Switch name="Valor" bind:checked={item.value} />
    {:else if selectedSettingType === SettingTypes.NUMBER}
      <Views.TextEdit
        placeHolder="Valor"
        bind:value={item.value}
        initialValue={item.value}
        type={Types.TTextEdit.NUMBER}
      />
    {:else if selectedSettingType === SettingTypes.CURRENCY}
      <Views.TextEdit
        placeHolder="Valor"
        bind:value={item.value}
        initialValue={item.value}
        type={Types.TTextEdit.CURRENCY}
      />
    {/if}
  {/if}
  <Views.Divider />
  <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
  >
</div>

<style>
</style>
