<script>
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Resellers from "./pages/Resellers/Resellers.svelte";
  import Contracts from "./pages/Contracts/Contracts.svelte";
  import Contract from "./pages/Contracts/Contract.svelte";
  import NewReseller from "./pages/Resellers/NewReseller.svelte";
  import Profile from "./pages/Profile.svelte";
  import Result from "./pages/Result.svelte";
  import Plans from "./pages/Plans/Plans.svelte";
  import NewPlan from "./pages/Plans/NewPlan.svelte";
  import Settings from "./pages/Settings/Settings.svelte";
  import NewSetting from "./pages/Settings/NewSetting.svelte";
  import Terms from "./pages/Terms/Terms.svelte";
  import NewTerm from "./pages/Terms/NewTerm.svelte";
  import Apps from "./pages/Apps/Apps.svelte";
  import App from "./pages/Apps/App.svelte";
  import { StatusBar as _StatusBar } from "./stores/Setup";
  import Routes from "./stores/Routes";
  import { StatusBar } from "@ikomida/capacitor-plugin-status-bar";
  import { Views, Utils, Stores } from "@ikomida/components";
  import { onMount } from "svelte";
  import {
    faHome,
    faCutlery,
    faUser,
    faSitemap,
  } from "@fortawesome/free-solid-svg-icons";

  let logedIn = false;
  let router = Stores.Navigation.instance.router;
  $: route = $router.route;
  let auth;

  $: if ($auth) {
    logedIn = false;
    Utils.Jws.extractToken($auth).then((token) => {
      logedIn = token !== null;
    });
  } else {
    logedIn = false;
  }
  $: styleHeight = `${Number($_StatusBar.height) + 50}px`;

  const pages = [
    {
      name: "Home",
      callback: () => Stores.Navigation.instance.goTo(Routes.home),
      icon: faHome,
    },
    {
      name: "Plans",
      callback: () => Stores.Navigation.instance.goTo(Routes.plans),
      icon: faSitemap,
    },
    {
      name: "Contratos",
      callback: () => Stores.Navigation.instance.goTo(Routes.restaurants),
      icon: faCutlery,
    },
    {
      name: "Resellers",
      callback: () => Stores.Navigation.instance.goTo(Routes.resellers),
      icon: faCutlery,
    },
    {
      name: "Meus apps",
      callback: () => Stores.Navigation.instance.goTo(Routes.apps),
      icon: faCutlery,
    },
    {
      name: "Configurações",
      callback: () => Stores.Navigation.instance.goTo(Routes.settings),
      icon: faCutlery,
    },
    {
      name: "Termos",
      callback: () => Stores.Navigation.instance.goTo(Routes.terms),
      icon: faCutlery,
    },
    {
      name: "Perfil",
      callback: () => Stores.Navigation.instance.goTo(Routes.profile),
      icon: faUser,
    },
  ];
  Stores.MenuHamburger.instance.reset();
  pages.forEach((page) => Stores.MenuHamburger.instance.addItem(page));

  onMount(async () => {
    auth = await Stores.Auth.Auth.instance.store();
    if (Capacitor.isNativePlatform()) {
      _StatusBar.setStatusBar(await StatusBar.getInfo());
    }
  });
</script>

<Views.LoadJS
  url="https://www.google.com/recaptcha/api.js?render=6LebYzshAAAAAIXhka3WrAjus5tDXtefR1QefVZS"
/>
{#if logedIn}
  <main
    style="padding: 20px;margin-top:{styleHeight}; overflow: scroll;max-width: 100%;background: #dfdfdf;height: 100%;{$_StatusBar.bottomPadding};  "
  >
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
    paddingTop={$_StatusBar.height}
    topMargin={$_StatusBar.topMargin}
  />
{:else if route == Routes.login}
  <Login />
{:else}
  <Login />
{/if}
<Views.Loading
  topPadding={$_StatusBar.height}
  bottomPadding={$_StatusBar.bottomPadding}
/>
<Views.MessageAlert />

<style>
  :global(.grecaptcha-badge) {
    visibility: hidden;
  }
</style>
