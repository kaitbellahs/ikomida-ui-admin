<script>
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Resellers from "./pages/Resellers/Resellers.svelte";
  import Restaurants from "./pages/Restaurants.svelte";
  import NewReseller from "./pages/Resellers/NewReseller.svelte";
  import Profile from "./pages/Profile.svelte";
  import Result from "./pages/Result.svelte";
  import Plans from "./pages/Plans/Plans.svelte";
  import NewPlan from "./pages/Plans/NewPlan.svelte";
  import Settings from "./pages/Settings/Settings.svelte";
  import NewSetting from "./pages/Settings/NewSetting.svelte";
  import Terms from "./pages/Terms/Terms.svelte";
  import NewTerm from "./pages/Terms/NewTerm.svelte";
  import { Auth } from "./stores/Auth";
  import { StatusBar as _StatusBar } from "./stores/Setup";
  import {
    Router,
    Routes,
    Navigation,
    Title,
    Menu,
    MenuHamburger,
  } from "./stores/Navigation";
  import { StatusBar } from "@ikomida/capacitor-plugin-status-bar";
  import { Views, Utils } from "@ikomida/components";
  import { onMount } from "svelte";
  import {
    faHome,
    faCutlery,
    faUser,
    faSitemap,
  } from "@fortawesome/free-solid-svg-icons";

  let logedIn = false;
  $: route = $Router.route;

  $: if ($Auth) {
    logedIn = false;
    Utils.Jws.extractToken($Auth).then((token) => {
      logedIn = token !== null;
    });
  } else {
    logedIn = false;
  }
  $: styleHeight = `${Number($_StatusBar.height) + 50}px`;

  const pages = [
    {
      name: "Home",
      callback: () => Navigation.goTo(Routes.home),
      icon: faHome,
    },
    {
      name: "Plans",
      callback: () => Navigation.goTo(Routes.plans),
      icon: faSitemap,
    },
    {
      name: "Restaurantes",
      callback: () => Navigation.goTo(Routes.restaurants),
      icon: faCutlery,
    },
    {
      name: "Resellers",
      callback: () => Navigation.goTo(Routes.resellers),
      icon: faCutlery,
    },
    {
      name: "Configurações",
      callback: () => Navigation.goTo(Routes.settings),
      icon: faCutlery,
    },
    {
      name: "Termos",
      callback: () => Navigation.goTo(Routes.terms),
      icon: faCutlery,
    },
    {
      name: "Perfil",
      callback: () => Navigation.goTo(Routes.profile),
      icon: faUser,
    },
  ];
  MenuHamburger.reset();
  pages.forEach((page) => MenuHamburger.addItem(page));

  onMount(async () => {
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
    <div>
      {#if route == Routes.about}
        <About />
      {:else if route == Routes.home}
        <Home />
      {:else if route == Routes.resellers}
        <Resellers />
      {:else if route == Routes.restaurants}
        <Restaurants />
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
      {:else}
        <Home />
      {/if}
    </div>
  </main>
  <Views.NavigationBar
    {MenuHamburger}
    {Menu}
    {Title}
    paddingTop={$_StatusBar.height}
    topMargin={$_StatusBar.topMargin}
    {Navigation}
  />
{:else if route == Routes.login}
  <Login />
{:else}
  <Login />
{/if}

<style>
  :global(.grecaptcha-badge) {
    visibility: hidden;
  }
</style>
