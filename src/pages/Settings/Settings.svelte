<script lang="ts">
  import Routes from '../../stores/Routes'
  import { getSettings, removeSetting, activateSetting } from '../../network/Settings'
  import { Views, Stores, Types } from '@ikomida/shared-frontend'

  import { StatusBar } from '../../stores/Setup'
  import SettingTypes from '../../types/SettingTypes'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'

  let items: Types.Classes.CSetting[]

  $: if (items) {
    items = Types.Classes.CSetting.fromObject(items)
  }

  onMount(async () => {
    Stores.Loading.instance.stop()
  })

  async function newSetting() {
    Stores.Navigation.instance.goTo(Routes.newSetting, {
      item: {
        id: null,
        name: null,
        value: null,
        type: null
      },
      edit: false
    })
  }
  async function editSetting(item?: Types.Classes.CSetting) {
    Stores.Navigation.instance.goTo(Routes.newSetting, {
      item,
      edit: true
    })
  }
  async function onRemoveClick(id?: string) {
    Stores.Loading.instance.start()
    let response = await removeSetting(id)
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
    let response = await activateSetting(
      Types.Classes.CSetting.fromObject({
        id,
        active: !checked
      })
    )
    if (response && response?.success) {
      Stores.LoadMore.instance.refresh()
    } else {
      Stores.Loading.instance.stop()
      Stores.MessageAlert.instance.show(response?.data)
      items = items.map(item => {
        if (item?.id === id) {
          item.active = !checked
        }
        return item
      })
    }
    Stores.Loading.instance.stop()
  }

  Stores.Title.instance.set('Configurções')
</script>

<Views.Button on:click={newSetting} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Nova configuração</span></Views.Button
>
<Views.Divider />

<Views.LoadMoreReusableList
  noItems="Não há configurações para exibir!"
  cache={Stores.Cache.Types.SETTINGS}
  url="/admin/settings"
  bind:items
  let:index
>
  <article>
    <Views.FloatRemove callback={() => onRemoveClick(items[index].id)} />
    <Views.FloatEdit callback={() => editSetting(items[index])} top={45} />
    <h2>{items[index].name}</h2>
    <div class="value">
      value: {items[index].type === Types.Types.TSetting.BOOL
        ? items[index].value === '0'
          ? 'false'
          : 'true'
        : items[index].value}
    </div>
    <div>Tipo: {items[index].type.name}</div>

    <!-- <Views.Switch
            name="Ativo:"
            bind:checked={item.active}
            on:check={(event) => onActivateClick(item.id, event)}
          /> -->
  </article>
</Views.LoadMoreReusableList>

<style>
  article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
    overflow: hidden;
  }
  article > .value {
    padding: 10px 0;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
