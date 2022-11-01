<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'
  import { StatusBar } from '../../stores/Setup'
  import { Views, Types, Stores, Network, Utils } from '@ikomida/shared-frontend'
  import { newPlan, editPlan } from '../../network/Plans'
  import { onMount } from 'svelte'

  const router = Stores.Navigation.instance.router
  const item: Types.Classes.CPlan = $router.options.item
  const edit = $router.options.edit

  const addDetail = () => {
    item?.details?.push(Types.Classes.CKeyValue.fromObject({ key: undefined, value: undefined }))
    item.details = item?.details
  }

  const submit = async () => {
    Stores.Loading.instance.start()
    let response
    if (edit) {
      response = await editPlan(item)
    } else {
      response = await newPlan(item)
    }
    if (response.success) {
      Network.instance?.clearCache(Stores.Cache.Types.PLANS)
      Stores.Navigation.instance.pop()
    } else {
      Stores.MessageAlert.instance.show(response?.data)
    }
    Stores.Loading.instance.stop()
  }
  onMount(() => {
    Stores.Loading.instance.stop()
  })
  Stores.Title.instance.set(edit ? 'Editar plano' : 'Novo plano')
</script>

<div class="plan">
  <h2>Dados do plano</h2>
  <Views.TextEdit
    placeHolder="Orden de exibição"
    type={Types.TTextEdit.NUMBER}
    bind:value={item.order}
    initialValue={item.order}
  />
  <Views.TextEdit
    placeHolder="Dias antes do vencimento."
    type={Types.TTextEdit.NUMBER}
    bind:value={item.dueDateAfterXDays}
    initialValue={item.dueDateAfterXDays}
  />
  <Views.TextEdit placeHolder="Nome" bind:value={item.name} initialValue={item.name} />
  <Views.TextEdit
    placeHolder="preço"
    type={Types.TTextEdit.CURRENCY}
    bind:value={item.price}
    initialValue={item.price}
  />
  <Views.Switch name="Destacado" bind:checked={item.highlighted} />
  <Views.Selector
    bind:selected={item.discountType}
    name="selecione uma opção"
    options={Types.Types.TDiscount.values()}
  />
  {#if item.discountType}
    {#if item.discountType === Types.Types.TDiscount.PERCENT}
      <Views.TextEdit
        type={Types.TTextEdit.PERCENT}
        placeHolder="Valor"
        bind:value={item.discount}
        initialValue={item.discount}
      />
    {:else if item.discountType === Types.Types.TDiscount.VALUE}
      <Views.TextEdit
        placeHolder="Valor"
        bind:value={item.discount}
        initialValue={item.discount}
        type={Types.TTextEdit.CURRENCY}
      />
    {/if}
  {/if}
  <h2>Detalhes do plano</h2>
  <Views.TextEdit
    placeHolder="Faturamento"
    type={Types.TTextEdit.CURRENCY}
    bind:value={item.billing}
    initialValue={item.billing}
  />
  <Views.TextEdit
    placeHolder="Colaboradores"
    type={Types.TTextEdit.NUMBER}
    bind:value={item.staff}
    initialValue={item.staff}
  />
  <Views.TextEdit
    placeHolder="Produtos"
    type={Types.TTextEdit.NUMBER}
    bind:value={item.products}
    initialValue={item.products}
  />
  <Views.TextEdit
    placeHolder="Opcoes por produto"
    type={Types.TTextEdit.NUMBER}
    bind:value={item.productOptions}
    initialValue={item.productOptions}
  />
  <Views.TextEdit
    placeHolder="Pedidos"
    type={Types.TTextEdit.NUMBER}
    bind:value={item.orders}
    initialValue={item.orders}
  />
  <Views.TextEdit
    placeHolder="Couons"
    type={Types.TTextEdit.NUMBER}
    bind:value={item.coupons}
    initialValue={item.coupons}
  />
  <Views.CheckBoxList title="Meios de suporte" bind:selected={item.support} options={Types.Types.TSupport.values()} />
  {#each item?.details ?? [] as detail (detail.key)}
    <div class="twoCells">
      <Views.TextEdit placeHolder="key" bind:value={detail.key} initialValue={detail.key} />
      <Views.TextEdit placeHolder="value" bind:value={detail.value} initialValue={detail.value ?? undefined} />
    </div>
  {/each}
  <Views.Divider />
  <Views.Button on:click={addDetail}><Fa icon={faEdit} /><span>Adicionar detalhes</span></Views.Button>
  <Views.Divider />
  <Views.Button on:click={submit} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /><span>Salvar</span></Views.Button
  >
</div>

<style>
  .twoCells {
    display: flex;
  }
</style>
