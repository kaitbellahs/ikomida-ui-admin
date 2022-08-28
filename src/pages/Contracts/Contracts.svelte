<script>
  import { getContract } from "../../network/Contracts";
  import { Views, Utils, Stores } from "@ikomida/components";
  import { StatusBar } from "../../stores/Setup";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faEdit, faSync } from "@fortawesome/free-solid-svg-icons";
  import { AppLauncher } from "@capacitor/app-launcher";
  import { Clipboard } from "@capacitor/clipboard";
  import Routes from "../../stores/Routes";
  import AppStoreStatus from "../../types/AppStoreStatus";

  onMount(async () => {
    Stores.Loading.instance.stop();
  });

  async function newContract() {
    const url = "https://ikomida.com";
    const { value } = await AppLauncher.canOpenUrl({ url });
    if (value) {
      await AppLauncher.openUrl({ url });
    } else {
      await Clipboard.write({ string: url });
      Stores.MessageAlert.instance.show(
        `Não foi possível abrir navigador externo: por favor abrir o seu navigaro e digitar esa URL: ${url}, também foi copiado para sua área de transferência!`
      );
    }
  }

  async function openContract(id) {
    const response = await getContract(id);
    if (response?.success) {
      Stores.Navigation.instance.goTo(Routes.contract, response?.data);
    } else {
      Stores.MessageAlert.instance.show(response?.data);
    }
  }

  Stores.Title.instance.set("Lista de contratos");
</script>

<Views.Button on:click={newContract} bottomPadding={$StatusBar.bottomPadding}
  ><Fa icon={faEdit} /> <span>Cadastrar novo Contracte</span></Views.Button
>
<Views.Divider />
<Views.LoadMore
  noItems="Não há contratos para exibir!"
  cache={Stores.Cache.Types.CONTRACTS}
  url="/admin/contracts"
  let:item
>
  <article on:click={openContract(item?.id)}>
    <h2>{item?.contractName ?? "-"}</h2>
    <div>ikomidaID: {item?.ikomidaID}</div>
    <div>Plano: {item?.plan?.name}</div>
    <div>Situação: {item?.status}</div>
    <div class="apps">
      {#each item?.apps as app}
        <div>
          <div>
            Plataforma: {app?.platform ?? "-"}
          </div>
          <div>
            Responsável: {app?.managedBy?.name ?? "não associado"}
          </div>
          <div>Situação: {new AppStoreStatus(app?.storeStatus).name}</div>
        </div>
      {/each}
    </div>
    <div>
      Inscrição: {Utils.Strings.dateToDateString(item?.createdAt)}
    </div>
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
  article > .apps > div {
    background: #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 10px 0;
  }
</style>
