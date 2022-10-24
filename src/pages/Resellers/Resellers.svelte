<script lang="ts">
  import Routes from '../../stores/Routes'
  import { Views, Utils, Stores, Types } from '@ikomida/shared-frontend'

  import { StatusBar } from '../../stores/Setup'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { faEdit } from '@fortawesome/free-solid-svg-icons'

  let items: Types.Classes.CUser[]

  $: if (items) {
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

<Views.Button on:click={newReseller} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Novo vendedor</span></Views.Button
>
<Views.Divider />
<Views.LoadMoreReusableList
  noItems="Não há revendedores cadastrados para exibir!"
  cache={Stores.Cache.Types.RESELLERS}
  url="/resellers"
  bind:items
  let:item
>
  <article>
    <h2>{item.name} {item.lastName}</h2>
    <div>Telefone: {Utils.Strings.formatAsPhone(item.phone)}</div>
    <div>Code: {item.referralCode}</div>
  </article>
</Views.LoadMoreReusableList>

<style>
  article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
  }
</style>
