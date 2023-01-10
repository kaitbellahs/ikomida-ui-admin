<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'
  import { StatusBar } from '../../../stores/Setup'
  import { Views, Stores, Types, Logics, Utils } from '@ikomida/shared-frontend'
  import { newCategory, updateCategory } from '../../../network/Products'
  import { onMount } from 'svelte'

  const router = Stores.Navigation.instance.router

  let category: Types.Classes.CProductCategory = $router.options.category
  let edit: boolean = $router.options.edit
  let itemValidation = {
    title: false
  }
  let alwaysShowCategory = true

  $: contract = $router.options?.contract as Types.Classes.CContract
  $: canContinue = itemValidation?.title

  const submit = async () => {
    Stores.Loading.instance.start()
    if (!contract?.id) {
      Stores.MessageAlert.instance.show('O Id do contrato nao foi localizado')
      Stores.Loading.instance.stop()
      return
    }
    if (alwaysShowCategory) {
      category.business = []
    }
    if (category.business && category.business.length > 0 && !Utils.Objects.validateBusinessTime(category.business)) {
      Stores.Loading.instance.stop()
      return
    }
    let response
    if (edit) {
      response = await updateCategory(contract.id, category)
    } else {
      response = await newCategory(contract.id, category)
    }
    if (response?.success) {
      Stores.Navigation.instance.pop(1)
    } else {
      Stores.MessageAlert.instance.show(response?.data)
    }
    Stores.Loading.instance.stop()
  }

  function isBusinessTime(business?: Types.Classes.CBusinessTime[]) {
    return (
      !business ||
      (Array.isArray(business) ? business : [business]).filter(businessDay => (businessDay.hours?.length ?? 0) > 0)
        .length === 0
    )
  }

  onMount(() => {
    if (!contract?.id) {
      Stores.MessageAlert.instance.show('O Id do contrato nao foi localizado')
      Stores.Loading.instance.stop()
      return
    }
    alwaysShowCategory = isBusinessTime(category.business)
    Stores.Loading.instance.stop()
  })

  Stores.Title.instance.set(`${edit ? 'Editar categoria' : 'Novo categoria'} - ${contract?.contractName}`)
</script>

<div class="category">
  <Views.TextEdit
    placeHolder="Nome da categoria"
    bind:value={category.title}
    bind:isValid={itemValidation.title}
    initialValue={category.title}
    min={3}
    max={100}
  />
  <Views.TextEdit
    type={Types.TTextEdit.TEXT}
    placeHolder="Descrição da categoria"
    bind:value={category.description}
    initialValue={category.description}
    min={3}
    max={256}
  />
  <Views.Divider />
  <Views.Switch name="Aparecer sempre" bind:checked={alwaysShowCategory} />
  {#if !alwaysShowCategory}
    <Views.DatePeriods
      refresh={!alwaysShowCategory}
      title="Horário de ativação da categoria"
      mandatory={true}
      bind:value={category.business}
    />
  {/if}
  <Views.Divider />
  <Views.Button disabled={!canContinue} on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Salvar</span></Views.Button
  >
</div>

<style>
  .category {
    padding-bottom: 48px;
  }
</style>
