<template>
  <div id="app">
    <h1>Cadastro de sala</h1>
    <form class="container-fluid">
      <div class="form-group">
        <label for="sala.nome" class="mr-2">Nome da sala</label>         
        <input type="text" id="sala.nome" name="sala.nome" v-model="nomeSala" class="form-control" />
      </div>
      <div class="row">
        <div class="col-2">
          <ul>
            <li v-for="(cenario, i) in listaCenario" :key="i" :id="cenario.id" :class="{ selecionado: cenario.selecionado }">
              <a href="#" @click="alterarCenarioSelecionado(cenario.id)">{{ cenario.id }}</a>
            </li>
          </ul> 
        </div>
        <div class="col-10">
          <div v-for="(cenario, i) in listaCenario" :key="i + '.cadastro'">
            <div v-show="cenario.selecionado">
              <CadastroCenario ref="cadastroCenario"
                  :id="cenario.id"
                  :listaItemCenarios="listaItemCenarios"
                  :listaObjetoCenarios="listaObjetoCenarios"
                  :dadosIniciais="cenario.dadosIniciais"
                  :tipoItem="tipoItem"
                  @origemCenarioAlterada="alterarDestinoItemCenarios"
                  @nomeCenarioAlterado="alterarNomeCenarioItemCenarios"
                  @itemAdicionado="adicionarItemCenarios" 
                  @nomeItemAlterado="alterarNomeItemItemCenarios"
                  @itemRemovido="removerItemCenarios"
                  @objetoRecipienteAlterado="alterarRecipienteObjetoCenarios"
                  @imagemObjetoAlterada="alterarImagemObjetoObjetoCenarios"></CadastroCenario>
              <div class="form-group">    
                <input type="button" value="Remover cenário" v-if="!existeCenarioDestinoItemCenarios(cenario.id)" @click="removerCenario(cenario.id)" class="btn btn-secondary"/>
              </div>
            </div>
          </div>
        </div>
      </div>  
      <div class="form-group">
        <input type="button" value="Adicionar novo cenário" @click="adicionarCenario()" class="btn btn-primary w-100" />
      </div>
      <div class="form-group">
        <input type="button" value="Salvar sala" @click="salvarSala()" class="btn btn-primary w-50" />
        <input type="button" value="Cancelar" @click="cancelarSala()" class="btn btn-secondary w-50" />
      </div>
    </form>
  </div>
</template>

<script>
import CadastroCenario from "./components/CadastroCenario"
import JsonTeste from './assets/teste.json'

export default {
  name: "CadastroSala", 
  components: {
    CadastroCenario
  }, 
  mounted() {
    let novaSala = false;
    if (novaSala) {
      this.adicionarCenario();
    }
    else{
      let sala = JsonTeste;
      this.id = sala.id;
      this.nomeSala = sala.nome;
      for (let i=0; i<sala.cenarios.length; i++) {
        let cenario = sala.cenarios[i];
        for (let j=0; j<cenario.listaCadeado.length; j++) {
          let cadeado = cenario.listaCadeado[j];
          this.listaItemCenarios.push({ id: cadeado.id, tipo: this.tipoItem.CADEADO, cenarioId: cenario.id, nomeCenario: cenario.nome ? cenario.nome : cenario.id, nomeItem: cadeado.nome ? cadeado.nome : cadeado.id, cenarioIdDestino: this.retornarCenarioDestinoItem(sala.cenarios, cadeado.id) });
        }
        for (let j=0; j<cenario.listaObjeto.length; j++) {
          let objeto = cenario.listaObjeto[j];
          this.listaObjetoCenarios.push({ id: objeto.id, tipo: this.tipoItem.OBJETO, cenarioId: cenario.id, nomeCenario: cenario.nome ? cenario.nome : cenario.id, nomeItem: objeto.nome ? objeto.nome : objeto.id, listaObjetoRecipienteIdDestino: this.retornarRecipientesDestinoObjeto(sala.cenarios, objeto.id), imagem: objeto.imagem });
        }
        for (let j=0; j<cenario.listaGrupoRecipiente.length; j++) {
          let grupoRecipiente = cenario.listaGrupoRecipiente[j];
          this.listaItemCenarios.push({ id: grupoRecipiente.id, tipo: this.tipoItem.GRUPO_RECIPIENTE, cenarioId: cenario.id, nomeCenario: cenario.nome ? cenario.nome : cenario.id, nomeItem: grupoRecipiente.nome ? grupoRecipiente.nome : grupoRecipiente.id, cenarioIdDestino: this.retornarCenarioDestinoItem(sala.cenarios, grupoRecipiente.id) });
        }
        for (let j=0; j<cenario.listaCenarioFilho.length; j++) {
          let cenarioFilho = cenario.listaCenarioFilho[j];
          this.listaItemCenarios.push({ id: cenarioFilho.id, tipo: this.tipoItem.CENARIO_FILHO, cenarioId: cenario.id, nomeCenario: cenario.nome ? cenario.nome : cenario.id, nomeItem: cenarioFilho.nome ? cenarioFilho.nome : cenarioFilho.id, cenarioIdDestino: this.retornarCenarioDestinoItem(sala.cenarios, cenarioFilho.id) });
        }
        this.listaCenario.push({
          id: cenario.id,
          dadosIniciais: cenario,
          selecionado: i == 0
        });
        if (i == sala.cenarios.length - 1) {
          this.idUnicoCenario = parseInt(cenario.id.replace(/cenario/g, ''));
        }
      }
    }
  },
  data: function() {
    return {
      id: -1,
      nomeSala: "",
      idUnicoCenario: 0,
      listaItemCenarios: [],
      listaObjetoCenarios: [],
      listaCenario: [],
      tipoItem: {
        CADEADO: "Cadeado", 
        OBJETO: "Objeto", 
        OBJETO_RECIPIENTE: "Recipiente de objeto", 
        GRUPO_RECIPIENTE: "Grupo de recipiente",
        CENARIO_FILHO: "Cenário filho"
      }
    }
  },
  methods: {
    adicionarCenario() {
      this.alterarCenarioSelecionado("");
      // Adiciona um cenário
      this.listaCenario.push({
        id: "cenario" + (++this.idUnicoCenario),
        dadosIniciais: {
          inicial: this.idUnicoCenario == 1
        },
        selecionado: true
      })
    },
    alterarCenarioSelecionado(cenarioId) {
      // Altera o cenário selecionado para ficar visível na tela
      for (let i=0; i<this.listaCenario.length; i++) {
        if (this.listaCenario[i].id === cenarioId) {
          this.listaCenario[i].selecionado = true;
        }
        else {
          this.listaCenario[i].selecionado = false;
        }
      }
    },
    removerCenario(cenarioId) {
      if (confirm("Confirma a exclusão do cenário?")) {
        // Remove como opção de Origem de cenário os itens do cenário removido
        for (let i=this.listaItemCenarios.length-1; i>=0; i--) {
          if (this.listaItemCenarios[i].cenarioId === cenarioId) {
            this.listaItemCenarios.splice(i, 1);
          }
        }
        // Remove como opção de Objeto para recipiente os itens do cenário removido
        for (let i=this.listaObjetoCenarios.length-1; i>=0; i--) {
          if (this.listaObjetoCenarios[i].cenarioId === cenarioId) {
            this.listaObjetoCenarios.splice(i, 1);
          }
        }
        // Remove o cenário
        for (let i=0; i<this.listaCenario.length; i++) {
          if (this.listaCenario[i].id === cenarioId) {
            this.listaCenario.splice(i, 1);
            break;
          }
        }
      }    
    },
    alterarNomeCenarioItemCenarios(cenario) {
      // Altera o nome do cenário na opção de Origem de cenário
      for (let i=0; i<this.listaItemCenarios.length; i++) {
        if (this.listaItemCenarios[i].cenarioId === cenario.cenarioId) {
          this.listaItemCenarios[i].nomeCenario = cenario.nomeCenario;
        }
      }
      // Altera o nome do cenário na opção de Objeto para recipiente
      for (let i=0; i<this.listaObjetoCenarios.length; i++) {
        if (this.listaObjetoCenarios[i].cenarioId === cenario.cenarioId) {
          this.listaObjetoCenarios[i].nomeCenario = cenario.nomeCenario;
        }
      }
    },
    adicionarItemCenarios(item) {      
      if (item.tipo === this.tipoItem.OBJETO) {
        // Adiciona item como opção de Objeto para recipiente
        this.listaObjetoCenarios.push(item);
      }
      else {
        // Adiciona item como opção de Origem de cenário
        this.listaItemCenarios.push(item);
      }
    },  
    alterarNomeItemItemCenarios(item) {     
      if (item.tipo === this.tipoItem.OBJETO) {
        // Altera o nome do item na opção de Objeto para recipiente
        for (let i=0; i<this.listaObjetoCenarios.length; i++) {
          if (this.listaObjetoCenarios[i].id === item.itemId) {
            this.listaObjetoCenarios[i].nomeItem = item.nomeItem === ""? item.itemId : item.nomeItem;
            break;
          }
        }
      }
      else {
        // Altera o nome do item na opção de Origem de cenário
        for (let i=0; i<this.listaItemCenarios.length; i++) {
          if (this.listaItemCenarios[i].id === item.itemId) {
            this.listaItemCenarios[i].nomeItem = item.nomeItem === ""? item.itemId : item.nomeItem;
            break;
          }
        }
      }
    },
    alterarImagemObjetoObjetoCenarios(objeto) {     
      // Altera a imagem do objeto na opção de Objeto para recipiente
      for (let i=0; i<this.listaObjetoCenarios.length; i++) {
        if (this.listaObjetoCenarios[i].id === objeto.itemId) {
          this.listaObjetoCenarios[i].imagem = objeto.imagem;
          break;
        }
      }
    },    
    removerItemCenarios(item) {     
      if (item.tipo === this.tipoItem.OBJETO) {
        // Remove como opção de Objeto para recipiente o item removido
        for (let i=0; i<this.listaObjetoCenarios.length; i++) {
          if (this.listaObjetoCenarios[i].id === item.id) {
            this.listaObjetoCenarios.splice(i, 1);
            break;
          }
        }
      }
      else {
        // Remove como opção de Origem de cenário o item removido
        for (let i=0; i<this.listaItemCenarios.length; i++) {
          if (this.listaItemCenarios[i].id === item.id) {
            this.listaItemCenarios.splice(i, 1);
            break;
          }
        }
      }
    },   
    alterarDestinoItemCenarios(cenario) {
      // Altera o destino do item que foi selecionado ou desselecionado como opção de Origem do cenário
      for (let i=0; i<this.listaItemCenarios.length; i++) {
        if (this.listaItemCenarios[i].id === cenario.itemId) {
          if (cenario.itemSelecionado) {
            this.listaItemCenarios[i].cenarioIdDestino = cenario.cenarioId;
          }
          else {
            this.listaItemCenarios[i].cenarioIdDestino = "";
          }
          break;
        }
      }
    },
    existeCenarioDestinoItemCenarios(cenarioId) {
      // Verifica se existe item desse cenário sendo utilizado como opção de Origem de cenário para outro cenário destino
      for (let i=0; i<this.listaItemCenarios.length; i++) {
        if (this.listaItemCenarios[i].cenarioId === cenarioId && this.listaItemCenarios[i].cenarioIdDestino !== "") {
          return true;
        }
      }
      return false;
    },
    alterarRecipienteObjetoCenarios(recipiente) {
      // Altera o destino do objeto que foi selecionado ou desselecionado como opção de objeto para um recipiente
      for (let i=0; i<this.listaObjetoCenarios.length; i++) {
        if (this.listaObjetoCenarios[i].id === recipiente.objetoId) {
          if (recipiente.objetoSelecionado) {
            this.listaObjetoCenarios[i].listaObjetoRecipienteIdDestino.push(recipiente.objetoRecipienteId);
          }
          else {
            for (let j=0; j<this.listaObjetoCenarios[i].listaObjetoRecipienteIdDestino.length; j++) {
              if (this.listaObjetoCenarios[i].listaObjetoRecipienteIdDestino[j] === recipiente.objetoRecipienteId) {
                this.listaObjetoCenarios[i].listaObjetoRecipienteIdDestino.splice(j, 1);
                break;
              }
            }
          }
          break;
        }
      }
    },
    salvarSala() {
      let cenarios = [];
      for (let i=0; i< this.listaCenario.length; i++) {    
        cenarios.push(this.$refs.cadastroCenario[i].retornarSalvar());
      }
      let sala = {
        id: this.id,
        nome: this.nomeSala,
        cenarios: cenarios
      }
      console.log("Salvar sala ", JSON.stringify(sala));
    },
    cancelarSala() {
      console.log("Cancelar sala");
    },
    retornarCenarioDestinoItem(cenarios, itemId) {
      for (let i=0; i<cenarios.length; i++) {
        let cenario = cenarios[i];
        for (let j=0; j<cenario.listaItemOrigem.length; j++) {
          if (cenario.listaItemOrigem[j] === itemId) {
            return cenario.id;
          }
        }
      }
      return "";
    },
    retornarRecipientesDestinoObjeto(cenarios, objetoId) {
      let retorno = []
      for (let i=0; i<cenarios.length; i++) {
        let cenario = cenarios[i];
        for (let j=0; j<cenario.listaObjetoRecipiente.length; j++) {
          let objetoRecipiente = cenario.listaObjetoRecipiente[j];
          for (let k=0; k<objetoRecipiente.objetos.length; k++) {
            if (objetoRecipiente.objetos[k] === objetoId) {
              retorno.push(objetoRecipiente.id);
            }
          }         
        }
      }
      return retorno;
    }
  } 
}
</script>

<style scoped>
  .selecionado {
    background-color: yellow;
  }
</style>