<script>
  import { Title, Navigation, Routes } from "../stores/Navigation";
  import {
    getSettings,
    removeSetting,
    activateSetting,
  } from "../network/Settings";
  import { Views, Utils } from "@ikomida/components";
  import { StatusBar } from "../stores/Setup";
  import SettingTypes from "../types/SettingTypes";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
  let settings;
  let isLoading = false;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }
  onMount(async () => {
    settings = await getSettings();
  });
  async function newSetting() {
    Navigation.goTo(Routes.newSetting, {
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
    Navigation.goTo(Routes.newSetting, {
      item,
      edit: true,
    });
  }
  async function onRemoveClick(id) {
    isLoading = true;
    let response = await removeSetting(id);
    if (response.success) {
      settings = await getSettings();
    } else {
      toggleErrorAlert(response?.data);
      isLoading = false;
      return;
    }
    isLoading = false;
  }
  async function onActivateClick(id, event) {
    const checked = event.detail?.checked;

    isLoading = true;
    let response = await activateSetting({
      id,
      active: !checked,
    });
    if (response && response?.success) {
      settings = await getSettings();
    } else {
      isLoading = false;
      toggleErrorAlert(response?.data);
      settings = settings.map((setting) => {
        if (setting?.id === id) {
          setting.active = !checked;
        }
        return setting;
      });
    }
    isLoading = false;
  }
  Title.set("Configurções");
</script>

<Views.Button on:click={newSetting} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Nova configuração</span></Views.Button
>
<Views.Divider />
{#if settings}
  <section>
    {#if settings.length > 0}
      {#each settings as setting}
        <article>
          <span on:click={onRemoveClick(setting.id)} class="remove"
            ><Fa icon={faTrashAlt} /></span
          >
          <span on:click={editSetting(setting)} class="edit"
            ><Fa icon={faEdit} /></span
          >
          <h2>{setting.name}</h2>
          <div>
            value: {SettingTypes[setting.type] === SettingTypes.BOOL
              ? setting.value === 0
                ? "false"
                : "true"
              : setting.value}
          </div>
          <div>Tipo: {SettingTypes[setting.type]}</div>

          <Views.Switch
            name="Ativo:"
            bind:checked={setting.active}
            on:checked={(event) => onActivateClick(setting.id, event)}
          />
        </article>
      {/each}
    {:else}
      Não há settingos para exibir!
    {/if}
  </section>
{/if}

{#if isLoading || !settings}
  <Views.Loading
    topPadding={$StatusBar.height}
    bottomPadding={$StatusBar.bottomPadding}
  />
{/if}

<Views.MessageAlert object={errorAlert} bind:show={showAlert} />

<style>
  section > article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
  }
  .remove {
    position: absolute;
    top: -8px;
    right: -10px;
    font-size: 1.3em;
    color: white;
    font-family: RobotoBold;
    border: 1px solid #b52124;
    background: #b52124;
    border-radius: 20px;
    width: 26px;
    height: 26px;
    vertical-align: middle;
    text-align: center;
    padding: 6px;
  }
  .edit {
    position: absolute;
    top: -8px;
    right: 35px;
    font-size: 0.9em;
    color: white;
    font-family: RobotoBold;
    border: 1px solid #b52124;
    background: #b52124;
    border-radius: 20px;
    width: 25px;
    height: 25px;
    vertical-align: middle;
    text-align: center;
    padding: 6px;
  }
</style>
