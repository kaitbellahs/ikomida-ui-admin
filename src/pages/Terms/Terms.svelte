<script lang="ts">
  import Routes from '../../stores/Routes'
  import { removeTerm, activateTerm } from '../../network/Terms'
  import { Views, Types, Stores } from '@ikomida/shared-frontend'

  import { StatusBar } from '../../stores/Setup'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'

  let items: Types.Classes.CTerm[]

  $: if (items) {
    items = Types.Classes.CTerm.fromObject(items)
  }
  onMount(async () => {
    Stores.Loading.instance.stop()
  })

  async function newTerm() {
    Stores.Navigation.instance.goTo(Routes.newTerm, {
      item: {
        id: null,
        name: null,
        text: null,
        type: null,
        active: null
      },
      edit: false
    })
  }
  async function editTerm(item?: Types.Classes.CTerm) {
    Stores.Navigation.instance.goTo(Routes.newTerm, {
      item,
      edit: true
    })
  }
  async function onRemoveClick(id?: string) {
    Stores.Loading.instance.start()
    let response = await removeTerm(id)
    if (response.success) {
      Stores.LoadMore.instance.refresh()
    } else {
      Stores.MessageAlert.instance.show(response?.data)
      Stores.Loading.instance.stop()
      return
    }
    Stores.Loading.instance.stop()
  }
  async function onActivateClick(id?: string, event?: any) {
    const checked = event.detail?.checked

    Stores.Loading.instance.start()
    let response = await activateTerm(
      Types.Classes.CTerm.fromObject({
        id,
        active: !checked
      })
    )
    if (response && response?.success) {
      Stores.LoadMore.instance.refresh()
    } else {
      Stores.Loading.instance.stop()
      Stores.MessageAlert.instance.show(response?.data)
      items = items.map(term => {
        if (term?.id === id) {
          term.active = !checked
        }
        return term
      })
    }
    Stores.Loading.instance.stop()
  }
  Stores.Title.instance.set('Configurções')
</script>

<div style="padding: 0 16pt;">
  <Views.Button on:click={newTerm} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Novo termo</span></Views.Button
  >
</div>
<Views.Divider />
<Views.LoadMoreReusableList
  noItems="Não há termos para exibir!"
  cache={Stores.Cache.Types.TERMS}
  url="/admin/terms"
  bind:items
  let:index
>
  <article class="shadow">
    <Views.FloatEdit callback={() => editTerm(items[index])} top={45} />
    <h2>{items[index].name}</h2>
    <div>Tipo: {items[index].type.description}</div>

    <Views.Switch
      name="Ativo:"
      bind:checked={items[index].active}
      on:check={async event => await onActivateClick(items[index].id, event)}
    />
  </article></Views.LoadMoreReusableList
>

<style>
  article {
    position: relative;
    border-radius: 8pt;
    padding: 16pt;
  }
</style>
