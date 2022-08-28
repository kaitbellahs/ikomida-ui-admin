<script>
  import Routes from "../../stores/Routes";
  import { removeTerm, activateTerm } from "../../network/Terms";
  import { Views, Types, Stores } from "@ikomida/components";

  import { StatusBar } from "../../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit } from "@fortawesome/free-solid-svg-icons";

  onMount(async () => {
    Stores.Loading.instance.stop();
  });

  async function newTerm() {
    Stores.Navigation.instance.goTo(Routes.newTerm, {
      item: {
        id: null,
        name: null,
        text: null,
        type: null,
        active: null,
      },
      edit: false,
    });
  }
  async function editTerm(item) {
    Stores.Navigation.instance.goTo(Routes.newTerm, {
      item,
      edit: true,
    });
  }
  async function onRemoveClick(id) {
    Stores.Loading.instance.start();
    let response = await removeTerm(id);
    if (response.success) {
      terms = await getTerms();
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
    let response = await activateTerm({
      id,
      active: !checked,
    });
    if (response && response?.success) {
      terms = await getTerms();
    } else {
      Stores.Loading.instance.stop();
      Stores.MessageAlert.instance.show(response?.data);
      terms = terms.map((term) => {
        if (term?.id === id) {
          term.active = !checked;
        }
        return term;
      });
    }
    Stores.Loading.instance.stop();
  }
  Stores.Title.instance.set("Configurções");
</script>

<Views.Button on:click={newTerm} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Novo termo</span></Views.Button
>
<Views.Divider />
<Views.LoadMore
  noItems="Não há termos para exibir!"
  cache={Stores.Cache.Types.TERMS}
  url="/admin/terms"
  let:item
>
  <article>
    <Views.FloatEdit callback={() => editTerm(item)} top="45" />
    <h2>{item.name}</h2>
    <div>Tipo: {new Types.TermTypes(item.type).description}</div>

    <!-- <Views.Switch
      name="Ativo:"
      bind:checked={item.active}
      on:check={(event) => onActivateClick(item.id, event)}
    /> -->
  </article></Views.LoadMore
>

<style>
  article {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
  }
</style>
