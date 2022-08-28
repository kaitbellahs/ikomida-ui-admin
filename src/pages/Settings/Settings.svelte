<script>
  import Routes from "../../stores/Routes";
  import {
    getSettings,
    removeSetting,
    activateSetting,
  } from "../../network/Settings";
  import { Views, Stores } from "@ikomida/components";

  import { StatusBar } from "../../stores/Setup";
  import SettingTypes from "../../types/SettingTypes";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit } from "@fortawesome/free-solid-svg-icons";

  onMount(async () => {
    Stores.Loading.instance.stop();
  });

  async function newSetting() {
    Stores.Navigation.instance.goTo(Routes.newSetting, {
      item: {
        id: null,
        name: null,
        value: null,
        type: null,
      },
      edit: false,
    });
  }
  async function editSetting(item) {
    Stores.Navigation.instance.goTo(Routes.newSetting, {
      item,
      edit: true,
    });
  }
  async function onRemoveClick(id) {
    Stores.Loading.instance.start();
    let response = await removeSetting(id);
    if (response.success) {
      settings = await getSettings();
    } else {
      Stores.MessageAlert.instance.show(response?.data);
      Stores.Loading.instance.stop();
      return;
    }
    Stores.Loading.instance.stop();
  }
  async function onActivateClick(id, event) {
    const checked = event.detail?.checked;

    Stores.Loading.instance.start();
    let response = await activateSetting({
      id,
      active: !checked,
    });
    if (response && response?.success) {
      settings = await getSettings();
    } else {
      Stores.Loading.instance.stop();
      Stores.MessageAlert.instance.show(response?.data);
      settings = settings.map((setting) => {
        if (setting?.id === id) {
          setting.active = !checked;
        }
        return setting;
      });
    }
    Stores.Loading.instance.stop();
  }

  Stores.Title.instance.set("Configurções");
</script>

<Views.Button on:click={newSetting} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Nova configuração</span></Views.Button
>
<Views.Divider />

<Views.LoadMore
  noItems="Não há configurações para exibir!"
  cache={Stores.Cache.Types.SETTINGS}
  url="/admin/settings"
  let:item
>
  <article>
    <Views.FloatRemove callback={() => onRemoveClick(item.id)} />
    <Views.FloatEdit callback={() => editSetting(item)} top="45" />
    <h2>{item.name}</h2>
    <div class="value">
      value: {SettingTypes[item.type] === SettingTypes.BOOL
        ? item.value === 0
          ? "false"
          : "true"
        : item.value}
    </div>
    <div>Tipo: {SettingTypes[item.type]}</div>

    <!-- <Views.Switch
            name="Ativo:"
            bind:checked={item.active}
            on:check={(event) => onActivateClick(item.id, event)}
          /> -->
  </article>
</Views.LoadMore>

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
