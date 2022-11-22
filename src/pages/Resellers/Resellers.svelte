<script lang="ts">
  import Routes from '../../stores/Routes'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'

  import { StatusBar } from '../../stores/Setup'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'

  let items: Types.Classes.CUser[]

  $: {
    items = Types.Classes.CUser.fromObject(items)
  }

  onMount(async () => {
    Stores.Loading.instance.stop()
  })

  async function newReseller() {
    Stores.Navigation.instance.goTo(Routes.newReseller)
  }
  Stores.Title.instance.set('Lista de vendedores')
</script>

<div style="padding: 0 16pt;">
  <Views.Button on:click={newReseller} bottomPadding={$StatusBar.bottomPadding}
    ><Fa icon={faEdit} /> <span>Novo vendedor</span></Views.Button
  >
</div>
<Views.Divider />
<Views.LoadMoreReusableList
  noItems="Não há revendedores cadastrados para exibir!"
  cache={Stores.Cache.Types.RESELLERS}
  url="/resellers"
  bind:items
  let:index
>
  <article class="shadow">
    <h2>{items[index].name} {items[index].lastName}</h2>
    <div>Telefone: {Utils.Strings.formatAsPhone(items[index].phone)}</div>
    <div>Code: {items[index].referralCode}</div>
  </article>
</Views.LoadMoreReusableList>

<style>
  article {
    position: relative;
    border-radius: 8pt;
    padding: 16pt;
  }
</style>
