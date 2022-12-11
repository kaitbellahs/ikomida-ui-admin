<script lang="ts">
  import About from './pages/Unlogged/About.svelte'
  import Login from './pages/Unlogged/Login.svelte'
  import Home from './pages/Home.svelte'
  import Resellers from './pages/Resellers/Resellers.svelte'
  import Contracts from './pages/Contracts/Contracts.svelte'
  import Contract from './pages/Contracts/Contract.svelte'
  import NewReseller from './pages/Resellers/NewReseller.svelte'
  import Profile from './pages/Profile.svelte'
  import Result from './pages/Result.svelte'
  import Plans from './pages/Plans/Plans.svelte'
  import NewPlan from './pages/Plans/NewPlan.svelte'
  import Settings from './pages/Settings/Settings.svelte'
  import NewSetting from './pages/Settings/NewSetting.svelte'
  import Terms from './pages/Terms/Terms.svelte'
  import NewTerm from './pages/Terms/NewTerm.svelte'
  import Apps from './pages/Apps/Apps.svelte'
  import App from './pages/Apps/App.svelte'
  import { StatusBar as _StatusBar } from './stores/Setup'
  import Routes from './stores/Routes'
  import { StatusBar } from '@ikomida/capacitor-plugin-status-bar'
  import { faHome, faCutlery, faUser, faSitemap } from '@fortawesome/free-solid-svg-icons'
  import { Network } from '@capacitor/network'
  import type { ConnectionStatus } from '@capacitor/network'
  import { Utils, Views, Network as iKomidaNetwork, Stores, Types } from '@ikomida/shared-frontend'
  import { registerPushNotificationToken } from './network/PushNotification'
  import { Capacitor } from '@capacitor/core'
  import type { IAlertButton } from '@ikomida/shared-frontend/lib/components/Alert.svelte'
  import { onMount, tick } from 'svelte'
  import type { StatusBarType } from './stores/Setup'
  import Tac from './pages/Unlogged/Tac.svelte'
  import ForgotPassword from './pages/Unlogged/ForgotPassword.svelte'
  import LaunchScreen from './pages/Unlogged/LaunchScreen.svelte'

  let initialazation = true
  let logedIn = false
  let showNotificationPopup = false
  let auth: Stores.Auth.IStore
  let router = Stores.Navigation.instance.router
  let notificationIds: string[] = []
  let networkStatus: ConnectionStatus | null = null
  let cache: Stores.Cache = Stores.Cache.instance
  let network: iKomidaNetwork | undefined = iKomidaNetwork.instance
  let navigation: Stores.Navigation = Stores.Navigation.instance
  let notificationPopup = {
    title: '',
    body: '',
    buttons: [] as IAlertButton[]
  }
  function togglePushNotificationPopup() {
    showNotificationPopup = !showNotificationPopup
  }
  let pushNotification = new Utils.PushNotification(
    hasRegisteredCallBack,
    receivedCallBack,
    actionPerformedCallBack,
    hasErrorCallBack,
    permissionStatus
  )

  $: route = $router.route
  $: if ($auth) {
    Utils.Jws.extractToken($auth).then(async token => {
      logedIn = token !== null
    })
  } else if (!$auth && logedIn) {
    logedIn = false
  }
  $: if (!networkStatus?.connected) {
    const statusBar = $_StatusBar
    statusBar.topMargin = 22
    _StatusBar.setStatusBar(statusBar)
  } else {
    const statusBar = $_StatusBar
    statusBar.topMargin = 0
    _StatusBar.setStatusBar(statusBar)
  }

  async function openNotification(notification: Types.Classes.CNotificationPayload) {
    if (logedIn) {
      if (notification?.data?.uri && ['/order/', '/orders/'].includes(notification.data?.uri)) {
        const cachedOrders = (cache.getObject(Stores.Cache.Types.ORDERS) ?? []) as Types.Classes.COrder[]
        if (cachedOrders.length > 0) {
          const order = cachedOrders.filter(cachedOrder => cachedOrder.id === notification.data?.payload)?.[0]
          // navigation.goTo(Routes.order, order)
        }
      } else if (notification?.data?.uri && ['/subscription/'].includes(notification?.data?.uri)) {
        navigation.reset(Routes.home)
        await tick()
        Stores.Loading.instance.reset()
        // navigation.goTo(Routes.subscription)
      }
    }
  }

  async function hasRegisteredCallBack(token: string, platform: string) {
    const tokenObject: Types.Classes.CRegisterPushNotification = Types.Classes.CRegisterPushNotification.fromObject({
      platform,
      token
    })
    Stores.PushNotificationToken.instance.setToken(token)
    await registerPushNotificationToken(tokenObject)
  }

  async function hasErrorCallBack(error: any) {
    //TODO: -- handle and report error
    console.error(`level: 'error', message: ${JSON.stringify(error)}`)
  }

  async function permissionStatus(permissionStatus: any) {
    //TODO: -- handle and report permissions
    console.log({
      level: 'info',
      message: `permissionStatusObject: ${JSON.stringify(permissionStatus)}`
    })
  }

  async function receivedCallBack(notification: Types.Classes.CNotificationPayload, go = false) {
    await tick()
    if (
      notification?.id &&
      !notificationIds.includes(notification?.id) &&
      (logedIn || !((notification?.data?.logon ?? 'true') === 'true'))
    ) {
      notificationIds.push(notification?.id)
      notificationPopup.title = notification?.title ?? ''
      notificationPopup.body = notification?.body ?? ''
      notificationPopup.buttons = [
        {
          name: 'Fechar',
          callback: togglePushNotificationPopup,
          principal: false
        }
      ]
      if (notification?.data?.uri) {
        notificationPopup?.buttons?.push({
          name: 'Abrir',
          callback: () => {
            showNotificationPopup = false
            openNotification(notification)
          },
          principal: true
        })
      }
      notificationPopup = notificationPopup
      if (logedIn) {
        if (notification?.data?.uri && ['/order/', '/orders/'].includes(notification?.data?.uri)) {
          // TODO: -- implement
        } else if (notification?.data?.uri && ['/subscription/'].includes(notification?.data?.uri)) {
          // if (route == Routes.subscription || go) {
          //   navigation.reset(Routes.home)
          //   await tick()
          //   Stores.Loading.instance.reset()
          //   navigation.goTo(Routes.subscription)
          // } else {
          //   togglePushNotificationPopup()
          // }
        } else {
          togglePushNotificationPopup()
        }
      }
    }
  }

  async function actionPerformedCallBack(notification: any) {
    await receivedCallBack(notification.notification, true)
  }

  onMount(async () => {
    auth = await Stores.Auth.Auth.instance.store()
    if ($auth) {
      const token = await Utils.Jws.extractToken($auth)
      logedIn = token !== null
    } else {
      logedIn = false
    }
    networkStatus = await Network.getStatus()
    if (Capacitor.isNativePlatform()) {
      const statusBar = (await StatusBar.getInfo()) as StatusBarType
      statusBar.topMargin = statusBar?.topMargin ?? 0
      _StatusBar.setStatusBar(statusBar)
      pushNotification.init()
    }
    initialazation = false
    await tick()
    // MARK: --test push notification
    // await actionPerformedCallBack({
    //   notification: {
    //     id: new Date().getTime(),
    //     title: 'test',
    //     body: 'test body',
    //     data: {
    //       logon: 'true',
    //       uri: '/order/',
    //       payload: 'c2445df0-1abe-4da9-836e-fb0108b396a7'
    //     }
    //   }
    // })
  })

  Network.addListener('networkStatusChange', status => {
    networkStatus = status
  })

  //--------------------------------

  $: menuHamburgerItems = [
    {
      name: 'Home',
      callback: () => Stores.Navigation.instance.goTo(Routes.home),
      icon: faHome
    },
    {
      name: 'Plans',
      callback: () => Stores.Navigation.instance.goTo(Routes.plans),
      icon: faSitemap
    },
    {
      name: 'Contratos',
      callback: () => Stores.Navigation.instance.goTo(Routes.restaurants),
      icon: faCutlery
    },
    {
      name: 'Resellers',
      callback: () => Stores.Navigation.instance.goTo(Routes.resellers),
      icon: faCutlery
    },
    {
      name: 'Meus apps',
      callback: () => Stores.Navigation.instance.goTo(Routes.apps),
      icon: faCutlery
    },
    {
      name: 'Configurações',
      callback: () => Stores.Navigation.instance.goTo(Routes.settings),
      icon: faCutlery
    },
    {
      name: 'Termos',
      callback: () => Stores.Navigation.instance.goTo(Routes.terms),
      icon: faCutlery
    },
    {
      name: 'Perfil',
      callback: () => Stores.Navigation.instance.goTo(Routes.profile),
      icon: faUser
    }
  ]

  $: styleHeight = `${Number($_StatusBar.height) + 60}pt`

  $: if (menuHamburgerItems) {
    Stores.MenuHamburger.instance.reset()
    menuHamburgerItems?.forEach(page => Stores.MenuHamburger.instance.addItem(page))
  }

  $: isPageList = [
    Routes.apps,
    Routes.contract,
    Routes.plans,
    Routes.resellers,
    Routes.settings,
    Routes.terms
  ].includes(route)
  $: style = `--padding: ${isPageList ? 0 : 16}pt;--paddingTop:${styleHeight};--paddingBottom: ${
    70 + $_StatusBar.bottomPadding
  }pt; overflow: scroll;`
</script>

{#if initialazation}
  <LaunchScreen />
{:else if logedIn}
  <main {style}>
    {#if route == Routes.about}
      <About />
    {:else if route == Routes.home}
      <Home />
    {:else if route == Routes.resellers}
      <Resellers />
    {:else if route == Routes.restaurants}
      <Contracts />
    {:else if route == Routes.newReseller}
      <NewReseller />
    {:else if route == Routes.profile}
      <Profile />
    {:else if route == Routes.result}
      <Result />
    {:else if route == Routes.plans}
      <Plans />
    {:else if route == Routes.newPlan}
      <NewPlan />
    {:else if route == Routes.settings}
      <Settings />
    {:else if route == Routes.newSetting}
      <NewSetting />
    {:else if route == Routes.terms}
      <Terms />
    {:else if route == Routes.newTerm}
      <NewTerm />
    {:else if route == Routes.contract}
      <Contract />
    {:else if route == Routes.apps}
      <Apps />
    {:else if route == Routes.app}
      <App />
    {:else}
      <Home />
    {/if}
  </main>

  <Views.NavigationBar
    logo="/assets/icons/transparent-logo-1.svg"
    paddingTop={$_StatusBar.height}
    topMargin={$_StatusBar.height}
    paddingBottom={$_StatusBar.bottomPadding}
  />
{:else if route == Routes.login}
  <Login />
{:else if route == Routes.forgotPassword}
  <ForgotPassword />
{:else if route == Routes.tac}
  <Tac />
{:else}
  <Login />
{/if}
<Views.LoadJS url="https://www.google.com/recaptcha/api.js?render=6LebYzshAAAAAIXhka3WrAjus5tDXtefR1QefVZS" />
{#if networkStatus == null || !networkStatus.connected}
  <div id="internetError">Esperando por conexão a internet...</div>
{/if}
{#if showNotificationPopup}
  <Views.Alert
    title={notificationPopup?.title}
    message={notificationPopup?.body}
    closeCallBack={togglePushNotificationPopup}
    buttons={notificationPopup?.buttons}
  />
{/if}
<Views.Loading topPadding={$_StatusBar.height} bottomPadding={$_StatusBar.bottomPadding} />
<Views.MessageAlert />

<style>
  main {
    padding: var(--padding);
    padding-top: var(--paddingTop);
    overflow: hidden;
    max-width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-bottom: var(--paddingBottom);
    height: 100vh;
    overflow: scroll;
  }
  :global(*, *:before, *:after) {
    margin: 0;
    padding: 0;
    font-weight: normal;
    box-sizing: border-box;
  }
  :global(body) {
    padding-top: 0;
    padding-bottom: 0;
  }
  #internetError {
    background-color: #4c0708;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 12pt;
    padding-right: 12pt;
  }
  :global(.grecaptcha-badge) {
    visibility: hidden;
  }
</style>
