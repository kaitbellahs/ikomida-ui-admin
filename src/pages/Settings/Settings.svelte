<script>
  import { Title, Navigation, Routes, Menu } from "../../stores/Navigation";
  import {
    getSettings,
    removeSetting,
    activateSetting,
  } from "../../network/Settings";
  import { Views, Utils } from "@ikomida/components";
  import { StatusBar } from "../../stores/Setup";
  import SettingTypes from "../../types/SettingTypes";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import {
    faEdit,
    faTrashAlt,
    faSync,
  } from "@fortawesome/free-solid-svg-icons";
  import Cache from "../../stores/Cache";
  let settings;

  const CACHE_NAME = "SETTINGS";
  let hasMore = true;
  let canGetMore = true;
  let lastTimestamp = null;

  async function getMore(e, refresh = false) {
    if (refresh || (canGetMore && hasMore)) {
      const timestamp = refresh
        ? 0
        : settings?.[settings.length - 1]?.timestamp ?? -1;
      canGetMore = false;
      settings = Cache.getObject(CACHE_NAME);
      const newSettings = await getSettings(timestamp);
      hasMore = newSettings.length > 0;
      settings = refresh
        ? newSettings
        : settings
        ? [...settings, ...newSettings]
        : newSettings;
      settings.sort((item1, item2) => item2.timestamp - item1.timestamp);
      Cache.setObject(CACHE_NAME, settings);
      canGetMore = refresh || lastTimestamp !== timestamp;
      lastTimestamp = timestamp;
    }
  }

  onMount(async () => {
    settings = Cache.getObject(CACHE_NAME);
    if (!settings) {
      await getMore(null, true);
    }
  });

  async function refresh() {
    await getMore(null, true);
  }

  Menu.addItem({ name: "Atualizar", icon: faSync, callback: refresh });

  let isLoading = false;
  let errorAlert;
  let showAlert = false;
  function toggleErrorAlert(messageObject) {
    errorAlert = messageObject;
    showAlert = true;
  }

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
  {#if settings.length > 0}
    <section>
      {#each settings as setting (setting?.id)}
        <article>
          <Views.FloatRemove callback={() => onRemoveClick(setting.id)} />
          <Views.FloatEdit callback={() => editSetting(setting)} top="45" />
          <h2>{setting.name}</h2>
          <div class="value">
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
            on:check={(event) => onActivateClick(setting.id, event)}
          />
        </article>
      {/each}
      <Views.Divider />
      {#if hasMore && !canGetMore}
        <Views.LocalLoading />
      {:else}
        <Views.Button disabled={!hasMore || !canGetMore} on:click={getMore}
          >carregar mais</Views.Button
        >
      {/if}
    </section>
  {:else}
    <Views.CentredMessage
      text="Não há configurações cadastradas para exibir!"
    />
  {/if}
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
    overflow: hidden;
  }
  section > article > .value {
    padding: 10px 0;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
