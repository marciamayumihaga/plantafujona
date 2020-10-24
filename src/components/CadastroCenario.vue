<template>
  <div class="container-fluid mt-3">
    <div v-if="!final" class="mb-2 form-group">
        <input type="checkbox" :id="id + '.inicial'" :name="id + '.inicial'" v-model="inicial" class="form-check-input">
        <label :for="id + '.inicial'" class="form-check-label"> Cenário inicial</label>
    </div>
    <div v-if="!inicial" class="form-group">
        <label>Origem</label>
        <div v-for="item in listaItemCenarios.filter(filtrarItemCenarios)" :key="item.id + '.origem'">
            <input type="checkbox" :id="item.id + '.origem'" :name="item.id + '.origem'" :checked="verificaOrigemSelecionada(item.id)" :value="item.id" @change="alterarOrigem" class="form-check-input">
            <label :for="item.id + '.origem'" class="form-check-label">{{ " [" + item.nomeCenario + "] " + item.tipo + " - " + item.nomeItem }}</label>
        </div>
        <small v-if="listaItemCenarios.filter(filtrarItemCenarios).length == 0" class="form-text text-muted">Nenhuma opção de origem encontrada.</small>
    </div>
    <div v-if="!inicial && listaCadeado.length == 0 && listaObjeto.length == 0 && listaObjetoRecipiente.length == 0 && listaGrupoRecipiente.length == 0 && listaCenarioFilho.length == 0" class="form-group">
        <input type="checkbox" :id="id + '.final'" :name="id + '.final'" v-model="final" class="form-check-input">
        <label :for="id + '.final'" class="form-check-label"> Cenário final</label>
    </div>
    <div class="form-group">
        <label :for="id + '.nome'">Nome do cenário</label>
        <input type="text" :id="id + '.nome'" :name="id + '.nome'" v-model="nomeCenario" @keyup="$emit('nomeCenarioAlterado', { cenarioId: id, nomeCenario: nomeCenario })" class="form-control" v-focus-on-create/>
    </div>
    <div class="form-group">
        <label :for="id + '.imagem'">Imagem do cenário</label>
        <input type="file" accept="image/*" :id="id + '.imagem'" :name="id + '.imagem'" @change="imagemCenarioAlterada" class="form-control-file"/> 
    </div>
    <div v-if="!final" class="form-group">
        <input type="button" value="Adicionar cadeado" @click="adicionarCadeado()" class="btn btn-primary" />
        <input type="button" value="Adicionar objeto" @click="adicionarObjeto()" class="btn btn-primary" />
        <input type="button" value="Adicionar recipiente de objeto" @click="adicionarObjetoRecipiente()" class="btn btn-primary" />
        <input type="button" value="Adicionar grupo de recipiente" @click="adicionarGrupoRecipiente()" class="btn btn-primary" />
        <input type="button" value="Adicionar cenário filho" @click="adicionarCenarioFilho()" class="btn btn-primary" />
    </div>
    <div class="form-group cenario-area">
        <div class="area-marca-tamanho" v-if="itemSelecionadoCenario.id && itemSelecionadoCenario.tipo !== tipoItem.GRUPO_RECIPIENTE">
            <div :id="'mtl'" class="marca-tamanho" 
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) - marcaTamanhoPosicaoPadrao) + 'px;'" 
                        v-dragged="alterarTamanhoItemCenario"></div>
            <div :id="'mtc'" class="marca-tamanho"
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) + ((itemSelecionadoCenario.largura ? itemSelecionadoCenario.largura : itemTamanhoPadrao) / 2) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) - marcaTamanhoPosicaoPadrao) + 'px;'" 
                        v-dragged="alterarTamanhoItemCenario"></div>            
            <div :id="'mtr'" class="marca-tamanho"
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) + (itemSelecionadoCenario.largura ? itemSelecionadoCenario.largura : itemTamanhoPadrao) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) - marcaTamanhoPosicaoPadrao) + 'px;'"
                        v-dragged="alterarTamanhoItemCenario"></div>
            <div :id="'mbl'" class="marca-tamanho"
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) + (itemSelecionadoCenario.altura ? itemSelecionadoCenario.altura : itemTamanhoPadrao) - marcaTamanhoPosicaoPadrao) + 'px;'"
                        v-dragged="alterarTamanhoItemCenario"></div>
            <div :id="'mbc'" class="marca-tamanho"
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) + ((itemSelecionadoCenario.largura ? itemSelecionadoCenario.largura : itemTamanhoPadrao) / 2) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) + (itemSelecionadoCenario.altura ? itemSelecionadoCenario.altura : itemTamanhoPadrao) - marcaTamanhoPosicaoPadrao) + 'px;'"
                        v-dragged="alterarTamanhoItemCenario"></div>            
            <div :id="'mbr'" class="marca-tamanho"
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) + (itemSelecionadoCenario.largura ? itemSelecionadoCenario.largura : itemTamanhoPadrao) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) + (itemSelecionadoCenario.altura ? itemSelecionadoCenario.altura : itemTamanhoPadrao) - marcaTamanhoPosicaoPadrao) + 'px;'"
                        v-dragged="alterarTamanhoItemCenario"></div>
            <div :id="'mcl'" class="marca-tamanho" 
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) + ((itemSelecionadoCenario.altura ? itemSelecionadoCenario.altura : itemTamanhoPadrao) / 2) - marcaTamanhoPosicaoPadrao) + 'px;'" 
                        v-dragged="alterarTamanhoItemCenario"></div>
            <div :id="'mcr'" class="marca-tamanho"
                :style="'left:' + ((itemSelecionadoCenario.posicaoX ? itemSelecionadoCenario.posicaoX : 0) + (itemSelecionadoCenario.largura ? itemSelecionadoCenario.largura : itemTamanhoPadrao) - marcaTamanhoPosicaoPadrao) + 'px;'
                        + 'top:' + ((itemSelecionadoCenario.posicaoY ? itemSelecionadoCenario.posicaoY : 0) + ((itemSelecionadoCenario.altura ? itemSelecionadoCenario.altura : itemTamanhoPadrao) / 2) - marcaTamanhoPosicaoPadrao) + 'px;'"
                        v-dragged="alterarTamanhoItemCenario"></div>
        </div>
        <div class="area-items" :id="id + '.items'">
            <div v-for="cadeado in listaCadeado" :key="cadeado.id + '.item'" 
                :title="cadeado.nome ? cadeado.nome : cadeado.id" 
                class="cadeado" :class="{ selecionado: cadeado.id == itemSelecionadoCenario.id }" 
                :style="(cadeado.largura ? 'width:' + cadeado.largura + 'px;' : '')
                        + (cadeado.altura ? 'height:' + cadeado.altura + 'px;' : '')
                        + (cadeado.posicaoX ? 'left:' + cadeado.posicaoX + 'px;' : '')
                        + (cadeado.posicaoY ? 'top:' + cadeado.posicaoY + 'px;' : '')"
                @mousedown.stop="selecionarItemCenario(cadeado)"
                v-dragged="alterarPosicaoItemCenario">
            </div>
            <div v-for="objeto in listaObjeto" :key="objeto.id + '.item'" 
                :title="objeto.nome ? objeto.nome : objeto.id" 
                class="objeto" :class="{ selecionado: objeto.id == itemSelecionadoCenario.id }" 
                :style="(objeto.largura ? 'width:' + objeto.largura + 'px;' : '')
                        + (objeto.altura ? 'height:' + objeto.altura + 'px;' : '')
                        + (objeto.posicaoX ? 'left:' + objeto.posicaoX + 'px;' : '')
                        + (objeto.posicaoY ? 'top:' + objeto.posicaoY + 'px;' : '')"
                @mousedown.stop="selecionarItemCenario(objeto)"
                v-dragged="alterarPosicaoItemCenario">
                <div></div>
                <img v-if="objeto.imagem" :src="objeto.imagem" />
            </div>
            <div v-for="objetoRecipiente in listaObjetoRecipiente" :key="objetoRecipiente.id + '.item'" 
                :title="objetoRecipiente.nome ? objetoRecipiente.nome : objetoRecipiente.id" 
                class="objeto-recipiente" :class="{ selecionado: objetoRecipiente.id == itemSelecionadoCenario.id }" 
                :style="(objetoRecipiente.largura ? 'width:' + objetoRecipiente.largura + 'px;' : '')
                        + (objetoRecipiente.altura ? 'height:' + objetoRecipiente.altura + 'px;' : '')
                        + (objetoRecipiente.posicaoX ? 'left:' + objetoRecipiente.posicaoX + 'px;' : '')
                        + (objetoRecipiente.posicaoY ? 'top:' + objetoRecipiente.posicaoY + 'px;' : '')"
                @mousedown.stop="selecionarItemCenario(objetoRecipiente)"
                v-dragged="alterarPosicaoItemCenario">
                <div></div>
                <img v-if="objetoRecipiente.objetos.length" :src="retornarImagemObjeto(objetoRecipiente.objetos[0])" />
            </div>
            <div v-for="cenarioFilho in listaCenarioFilho" :key="cenarioFilho.id + '.item'" 
                :title="cenarioFilho.nome ? cenarioFilho.nome : cenarioFilho.id" 
                class="cenario-filho" :class="{ selecionado: cenarioFilho.id == itemSelecionadoCenario.id }" 
                :style="(cenarioFilho.largura ? 'width:' + cenarioFilho.largura + 'px;' : '')
                        + (cenarioFilho.altura ? 'height:' + cenarioFilho.altura + 'px;' : '')
                        + (cenarioFilho.posicaoX ? 'left:' + cenarioFilho.posicaoX + 'px;' : '')
                        + (cenarioFilho.posicaoY ? 'top:' + cenarioFilho.posicaoY + 'px;' : '')"
                @mousedown.stop="selecionarItemCenario(cenarioFilho)"
                v-dragged="alterarPosicaoItemCenario">
            </div>
        </div>
        <img v-if="imagemCenario" :src="imagemCenario" @mousedown="deselecionarItemCenario()"/>
        <div v-if="!imagemCenario" class="area-fundo" @mousedown="deselecionarItemCenario()"></div>
    </div>   
    <div class="form-group itens-cenario">
        <ul>
            <li v-for="cadeado in listaCadeado" :key="cadeado.id + '.item-list'" :class="{ selecionado: cadeado.id == itemSelecionadoCenario.id }">
                <a href="#" @click="selecionarItemCenario(cadeado)">{{ cadeado.tipo + " - " + (cadeado.nome === ""? cadeado.id : cadeado.nome) }}</a>
            </li>
            <li v-for="objeto in listaObjeto" :key="objeto.id + '.item-list'" :class="{ selecionado: objeto.id == itemSelecionadoCenario.id }">
                <a href="#" @click="selecionarItemCenario(objeto)">{{ objeto.tipo + " - " + (objeto.nome === ""? objeto.id : objeto.nome) }}</a>
            </li>
            <li v-for="objetoRecipiente in listaObjetoRecipiente" :key="objetoRecipiente.id + '.item-list'" :class="{ selecionado: objetoRecipiente.id == itemSelecionadoCenario.id }">
                <a href="#" @click="selecionarItemCenario(objetoRecipiente)">{{ objetoRecipiente.tipo + " - " + (objetoRecipiente.nome === ""? objetoRecipiente.id : objetoRecipiente.nome) }}</a>
            </li>
            <li v-for="grupoRecipiente in listaGrupoRecipiente" :key="grupoRecipiente.id + '.item-list'" :class="{ selecionado: grupoRecipiente.id == itemSelecionadoCenario.id }">
                <a href="#" @click="selecionarItemCenario(grupoRecipiente)">{{ grupoRecipiente.tipo + " - " + (grupoRecipiente.nome === ""? grupoRecipiente.id : grupoRecipiente.nome) }}</a>
            </li>
            <li v-for="cenarioFilho in listaCenarioFilho" :key="cenarioFilho.id + '.item-list'" :class="{ selecionado: cenarioFilho.id == itemSelecionadoCenario.id }">
                <a href="#" @click="selecionarItemCenario(cenarioFilho)">{{ cenarioFilho.tipo + " - " + (cenarioFilho.nome === ""? cenarioFilho.id : cenarioFilho.nome) }}</a>
            </li>
        </ul>
    </div>
    <div v-if="itemSelecionadoCenario.tipo == tipoItem.CADEADO" class="form-group">
        <div class="form-group">
            <label for="cadeado.nome">Nome do cadeado</label>
            <input type="text" id="cadeado.nome" name="cadeado.nome" v-model="itemSelecionadoCenario.nome" @keyup="$emit('nomeItemAlterado', { itemId: itemSelecionadoCenario.id, nomeItem: itemSelecionadoCenario.nome })" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="cadeado.imagemFoco">Imagem de foco</label>
            <input type="file" accept="image/*" id="cadeado.imagemFoco" name="cadeado.imagemFoco" @change="imagemFocoCadeadoAlterada" class="form-control-file"/> 
            <img v-if="itemSelecionadoCenario.imagemFoco" :src="itemSelecionadoCenario.imagemFoco" class="imagem-preview"/>
        </div>
        <div class="form-group">
            <label for="cadeado.tipoCadeado">Tipo de cadeado</label>
            <select id="cadeado.tipoCadeado" name="cadeado.tipoCadeado" v-model="itemSelecionadoCenario.tipoCadeado" @change="alterarOpcoesValoresTipoCadeado">
                <option :value="tipoCadeado.NUMERICO">Numérico</option>
                <option :value="tipoCadeado.LETRA">Letra</option>
                <option :value="tipoCadeado.SETA">Seta</option>
                <option :value="tipoCadeado.COR">Cor</option>
                <option :value="tipoCadeado.CUSTOMIZADO">Customizado</option>
            </select>
        </div>
        <div class="form-group" v-if="itemSelecionadoCenario.tipoCadeado == tipoCadeado.COR">
            <label >Opções de valores para cada dígito da senha</label>
            <ColorPicker :width="150" :height="150" :disabled="false" startColor="#ff0000" @colorChange="selecionarCorOpcoesValores"></ColorPicker>
            <input type="button" value="Adicionar cor" @click="adicionarOpcaoValor()" class="btn btn-secondary"/>
            <ul>
                <li v-for="(opcaoCor, i) in itemSelecionadoCenario.opcoesValores" :key="'cadeado.opcaoCor' + i" :style="'background-color:' + opcaoCor">
                    {{ opcaoCor }}
                    <input type="button" value="Remover cor" @click="removerOpcaoValor(opcaoCor)" class="btn btn-secondary"/>
                </li>
            </ul>
        </div>
        <div class="form-group" v-if="itemSelecionadoCenario.tipoCadeado == tipoCadeado.CUSTOMIZADO">
            <label >Opções de valores para cada dígito da senha</label>
            <input type="text" class="form-control" v-model="opcaoValorAdicionar" />
            <input type="button" value="Adicionar opção" @click="adicionarOpcaoValor()" class="btn btn-secondary"/>
            <ul>
                <li v-for="(opcaoCustomizada, i) in itemSelecionadoCenario.opcoesValores" :key="'cadeado.opcaoCustomizada' + i">
                    {{ opcaoCustomizada }}
                    <input type="button" value="Remover opção" @click="removerOpcaoValor(opcaoCustomizada)" class="btn btn-secondary"/>
                </li>
            </ul>
        </div>
        <div class="form-group">
            <label for="cadeado.qtdDigitosSenha">Quantidade de dígitos da senha</label>
            <input type="number" id="cadeado.qtdDigitosSenha" name="cadeado.qtdDigitosSenha" v-model.number="itemSelecionadoCenario.qtdDigitosSenha" class="form-control" :min="3" @change="alterarQtdDigitosSenhaCadeado"/>
        </div>
        <div class="form-group">
            <label>Senha</label>
            <div v-if="itemSelecionadoCenario.tipoCadeado != tipoCadeado.COR">
                <select v-for="(digitoSenha, i) in itemSelecionadoCenario.senha" :key="'cadeado.senha' + i">
                    <option v-for="(opcao, j) in itemSelecionadoCenario.opcoesValores" :key="'cadeado.senha' + i + '.opcao' + j" :value="opcao" :selected="opcao == digitoSenha">{{ opcao }}</option>
                </select>
            </div>
            <div v-if="itemSelecionadoCenario.tipoCadeado == tipoCadeado.COR">
                <div v-for="(digitoSenha, i) in itemSelecionadoCenario.senha" :key="'cadeado.senha' + i" class="select-customizado">
                    <input type="button" :value="digitoSenha" @click="abrirOpcoesSelectCustomizado('cadeado.senha' + i)" :style="'background-color:' + digitoSenha"/>
                    <ul v-show="'cadeado.senha' + i == selectCustomizadoAberto">
                        <li v-for="(opcao, j) in itemSelecionadoCenario.opcoesValores" :key="'cadeado.senha' + i + '.opcao' + j" :style="'background-color:' + opcao" @click="selecionarOpcaoSelectCustomizado(i, opcao)" :class="{ selecionado: opcao == digitoSenha }">{{ opcao }}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="cadeado.largura">Largura</label>
            <input type="number" id="cadeado.largura" name="cadeado.largura" v-model.number="itemSelecionadoCenario.largura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="cadeado.altura">Altura</label>
            <input type="number" id="cadeado.altura" name="cadeado.altura" v-model.number="itemSelecionadoCenario.altura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="cadeado.posicaoX">Posicao X</label>
            <input type="number" id="cadeado.posicaoX" name="cadeado.posicaoX" v-model.number="itemSelecionadoCenario.posicaoX" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="cadeado.posicaoY">Posicao Y</label>
            <input type="number" id="cadeado.posicaoY" name="cadeado.posicaoY" v-model.number="itemSelecionadoCenario.posicaoY" class="form-control"/>
        </div>
        <input type="button" value="Remover cadeado" v-if="!existeCenarioDestinoItemCenarios(itemSelecionadoCenario.id)" @click="removerCadeado(itemSelecionadoCenario.id)" class="btn btn-secondary"/>
    </div>
    <div v-if="itemSelecionadoCenario.tipo == tipoItem.OBJETO" class="form-group">
        <div class="form-group">
            <label for="objeto.nome">Nome do objeto</label>
            <input type="text" id="objeto.nome" name="objeto.nome" v-model="itemSelecionadoCenario.nome" @keyup="$emit('nomeItemAlterado', { itemId: itemSelecionadoCenario.id, nomeItem: itemSelecionadoCenario.nome, tipo: tipoItem.OBJETO })" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="objeto.imagem">Imagem</label>
            <input type="file" accept="image/*" id="objeto.imagem" name="objeto.imagem" @change="imagemObjetoAlterada" class="form-control-file"/> 
            <img v-if="itemSelecionadoCenario.imagem" :src="itemSelecionadoCenario.imagem" class="imagem-preview"/>
        </div>
        <div class="form-group">
            <label for="objeto.largura">Largura</label>
            <input type="number" id="objeto.largura" name="objeto.largura" v-model.number="itemSelecionadoCenario.largura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="objeto.altura">Altura</label>
            <input type="number" id="objeto.altura" name="objeto.altura" v-model.number="itemSelecionadoCenario.altura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="objeto.posicaoX">Posicao X</label>
            <input type="number" id="objeto.posicaoX" name="objeto.posicaoX" v-model.number="itemSelecionadoCenario.posicaoX" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="objeto.posicaoY">Posicao Y</label>
            <input type="number" id="objeto.posicaoY" name="objeto.posicaoY" v-model.number="itemSelecionadoCenario.posicaoY" class="form-control"/>
        </div>
        <input type="button" value="Remover objeto" v-if="!existeRecipienteDestinoObjetoCenarios(itemSelecionadoCenario.id)" @click="removerObjeto(itemSelecionadoCenario.id)" class="btn btn-secondary"/>
    </div>
    <div v-if="itemSelecionadoCenario.tipo == tipoItem.OBJETO_RECIPIENTE" class="form-group">
        <div class="form-group">
            <label for="objetorecipiente.nome">Nome do recipiente de objeto</label>
            <input type="text" id="objetorecipiente.nome" name="objetorecipiente.nome" v-model="itemSelecionadoCenario.nome" class="form-control"/>
        </div>
        <div class="form-group">
            <label>Objetos que esse recipiente pode receber</label>
            <div v-for="objeto in listaObjetoCenarios" :key="objeto.id + '.objetosrecipiente'">
                <input type="checkbox" :id="objeto.id + '.objetosrecipiente'" :name="objeto.id + '.objetosrecipiente'" :checked="verificaObjetoRecipienteSelecionado(objeto.id)" :value="objeto.id" @change="alterarObjetoRecipiente" class="form-check-input">
                <label :for="objeto.id + '.objetosrecipiente'" class="form-check-label">{{ " [" + objeto.nomeCenario + "] " + objeto.nomeItem }}</label>
            </div>
            <small v-if="listaObjetoCenarios.length == 0" class="form-text text-muted">Nenhuma opção de objeto encontrada.</small>
        </div>
        <div class="form-group">
            <label for="objeto.largura">Largura</label>
            <input type="number" id="objeto.largura" name="objeto.largura" v-model.number="itemSelecionadoCenario.largura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="objeto.altura">Altura</label>
            <input type="number" id="objeto.altura" name="objeto.altura" v-model.number="itemSelecionadoCenario.altura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="objeto.posicaoX">Posicao X</label>
            <input type="number" id="objeto.posicaoX" name="objeto.posicaoX" v-model.number="itemSelecionadoCenario.posicaoX" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="objeto.posicaoY">Posicao Y</label>
            <input type="number" id="objeto.posicaoY" name="objeto.posicaoY" v-model.number="itemSelecionadoCenario.posicaoY" class="form-control"/>
        </div>
        <input type="button" value="Remover recipiente de objeto" v-if="!existeGrupoRecipiente(itemSelecionadoCenario.id)" @click="removerObjetoRecipiente(itemSelecionadoCenario.id)" class="btn btn-secondary"/>
    </div>
    <div v-if="itemSelecionadoCenario.tipo == tipoItem.GRUPO_RECIPIENTE" class="form-group">
        <div class="form-group">
            <label for="gruporecipiente.nome">Nome do grupo de recipiente</label>
            <input type="text" id="gruporecipiente.nome" name="gruporecipiente.nome" v-model="itemSelecionadoCenario.nome" @keyup="$emit('nomeItemAlterado', { itemId: itemSelecionadoCenario.id, nomeItem: itemSelecionadoCenario.nome })" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="gruporecipiente.imagemFoco">Imagem de foco</label>
            <input type="file" accept="image/*" id="gruporecipiente.imagemFoco" name="gruporecipiente.imagemFoco" @change="imagemFocoGrupoRecipienteAlterada" class="form-control-file"/> 
            <img v-if="itemSelecionadoCenario.imagemFoco" :src="itemSelecionadoCenario.imagemFoco" class="imagem-preview"/>
        </div>
        <div class="form-group">
            <label>Recipientes do grupo</label>
            <div v-for="objetoRecipiente in listaObjetoRecipiente.filter(filtrarObjetoRecipiente)" :key="objetoRecipiente.id + '.recipientesgrupo'">
                <input type="checkbox" :id="objetoRecipiente.id + '.recipientesgrupo'" :name="objetoRecipiente.id + '.recipientesgrupo'" :checked="verificaGrupoRecipienteSelecionado(objetoRecipiente.id)" :value="objetoRecipiente.id" @change="alterarRecipienteGrupo" class="form-check-input">
                <label :for="objetoRecipiente.id + '.recipientesgrupo'" class="form-check-label">{{ " " + (objetoRecipiente.nome === ""? objetoRecipiente.id : objetoRecipiente.nome) }}</label>
            </div>
            <small v-if="listaObjetoRecipiente.filter(filtrarObjetoRecipiente).length == 0" class="form-text text-muted">Nenhuma opção de recipiente de objeto encontrada.</small>
        </div>
        <input type="button" value="Remover grupo de recipiente" v-if="!existeCenarioDestinoItemCenarios(itemSelecionadoCenario.id)" @click="removerGrupoRecipiente(itemSelecionadoCenario.id)" class="btn btn-secondary"/>
    </div>
    <div v-if="itemSelecionadoCenario.tipo == tipoItem.CENARIO_FILHO" class="form-group">
        <div class="form-group">
            <label for="cenariofilho.nome">Nome do cenário filho</label>
            <input type="text" id="cenariofilho.nome" name="cenariofilho.nome" v-model="itemSelecionadoCenario.nome" @keyup="$emit('nomeItemAlterado', { itemId: itemSelecionadoCenario.id, nomeItem: itemSelecionadoCenario.nome })" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="cenariofilho.imagemFoco">Imagem de foco</label>
            <input type="file" accept="image/*" id="cenariofilho.imagemFoco" name="cenariofilho.imagemFoco" @change="imagemFocoCenarioFilhoAlterada" class="form-control-file"/> 
            <img v-if="itemSelecionadoCenario.imagemFoco" :src="itemSelecionadoCenario.imagemFoco" class="imagem-preview"/>
        </div>        
        <div class="form-group">
            <label for="cenariofilho.largura">Largura</label>
            <input type="number" id="cenariofilho.largura" name="cenariofilho.largura" v-model.number="itemSelecionadoCenario.largura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="cenariofilho.altura">Altura</label>
            <input type="number" id="cenariofilho.altura" name="cenariofilho.altura" v-model.number="itemSelecionadoCenario.altura" class="form-control" :min="itemTamanhoMinimo"/>
        </div>
        <div class="form-group">
            <label for="cenariofilho.posicaoX">Posicao X</label>
            <input type="number" id="cenariofilho.posicaoX" name="cenariofilho.posicaoX" v-model.number="itemSelecionadoCenario.posicaoX" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="cenariofilho.posicaoY">Posicao Y</label>
            <input type="number" id="cenariofilho.posicaoY" name="cenariofilho.posicaoY" v-model.number="itemSelecionadoCenario.posicaoY" class="form-control"/>
        </div>
        <input type="button" value="Remover cenário filho" v-if="!existeCenarioDestinoItemCenarios(itemSelecionadoCenario.id)" @click="removerCenarioFilho(itemSelecionadoCenario.id)" class="btn btn-secondary"/>
    </div>
  </div>
</template>

<script>
import ColorPicker from 'vue-color-picker-wheel';

export default {
    name: "CadastroCenario",
    components: {
        ColorPicker
    },
    mounted() {
        if (this.dadosIniciais.id) {
            this.carregarDadosSalvos(this.dadosIniciais);
        }
    },
    props: {
        id: {}, 
        listaItemCenarios: { type: Array },
        listaObjetoCenarios: { type: Array },
        dadosIniciais: { type: Object },
        tipoItem: { type: Object }
    },
    data: function() {
        return {
            nomeCenario: "",
            imagemCenario: "",
            inicial: this.dadosIniciais.inicial,
            final: false,
            idUnicoItem: 0,
            listaCadeado: [],
            listaObjeto: [],
            listaObjetoRecipiente: [],
            listaGrupoRecipiente: [],
            listaCenarioFilho: [],
            listaItemOrigem: [],
            itemSelecionadoCenario: { id: "", tipo: "" },
            itemTamanhoPadrao: 50,
            itemTamanhoMinimo: 8,
            marcaTamanhoPosicaoPadrao: 4,
            tipoCadeado: {
                NUMERICO: 1, 
                LETRA: 2, 
                SETA: 3,
                COR: 4,
                CUSTOMIZADO: 5
            },
            opcaoValorAdicionar: "",
            selectCustomizadoAberto: ""
        }
    },
    methods: {
        imagemCenarioAlterada(e) {
            // Atualiza a visualização da imagem do cenário
            const imagem = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(imagem);
            reader.onload = e => {
                this.imagemCenario = e.target.result;
            };
        },
        filtrarItemCenarios(item) {
            // Exibe como opção de Origem do cenário apenas os itens que
            // não fazem parte do cenário
            // e ainda não foram utilizados como opção em outros cenários ou já está selecionado no próprio cenário
            return item.cenarioId !== this.id 
                    && (item.cenarioIdDestino === "" || item.cenarioIdDestino === this.id);
        },
        existeCenarioDestinoItemCenarios(itemId) {
            // Verifica se o item foi selecionado como opção de Origem em algum cenário, para não permitir remover
            for (let i=0; i<this.listaItemCenarios.length; i++) {
                if (this.listaItemCenarios[i].id === itemId && this.listaItemCenarios[i].cenarioIdDestino !== "") {
                    return true;
                }
            }
            return false;
        },
        verificaOrigemSelecionada(itemId) {
            // Verifica se o item está na lista de opções de Origem selecionadas do cenário
            for (let i=0; i<this.listaItemOrigem.length; i++) {
                if (this.listaItemOrigem[i] === itemId) {
                    return true;
                }
            }
            return false;
        },
        alterarOrigem(e) {
            // Adiciona ou remove um item da lista de opções de Origem selecionadas do cenário
            if (e.target.checked) {
                this.listaItemOrigem.push(e.target.value);
            }
            else {
                for (let i=0; i<this.listaItemOrigem.length; i++) {
                    if (this.listaItemOrigem[i] === e.target.value) {
                        this.listaItemOrigem.splice(i, 1);
                        break;
                    }
                }
            }
            this.$emit('origemCenarioAlterada', { cenarioId: this.id, itemId: e.target.value, itemSelecionado: e.target.checked })
        },
        selecionarItemCenario(item) {
            this.itemSelecionadoCenario = item;
        },
        deselecionarItemCenario() {
            this.itemSelecionadoCenario = { id: "", tipo: "" };
        },
        alterarPosicaoItemCenario({ deltaX, deltaY, first, last }) {
            if (first || last) {
                return;
            }
            this.itemSelecionadoCenario.posicaoX = (this.itemSelecionadoCenario.posicaoX ? this.itemSelecionadoCenario.posicaoX : 0) + deltaX;
            this.itemSelecionadoCenario.posicaoY = (this.itemSelecionadoCenario.posicaoY ? this.itemSelecionadoCenario.posicaoY : 0) + deltaY;
        },
        alterarTamanhoItemCenario({ el, deltaX, deltaY, first, last }) {
            if (first || last) {
                return;
            }
            let novaLargura = 0;
            let novaAltura = 0;
            if (el.id == "mtl") {
                novaLargura = (this.itemSelecionadoCenario.largura ? this.itemSelecionadoCenario.largura : this.itemTamanhoPadrao) - deltaX;
                novaAltura = (this.itemSelecionadoCenario.altura ? this.itemSelecionadoCenario.altura : this.itemTamanhoPadrao) - deltaX;
                if (novaLargura >= this.itemTamanhoMinimo && novaAltura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.posicaoX = (this.itemSelecionadoCenario.posicaoX ? this.itemSelecionadoCenario.posicaoX : 0) + deltaX;
                    this.itemSelecionadoCenario.largura = novaLargura;
                    this.itemSelecionadoCenario.posicaoY = (this.itemSelecionadoCenario.posicaoY ? this.itemSelecionadoCenario.posicaoY : 0) + deltaX;
                    this.itemSelecionadoCenario.altura = novaAltura;
                }
            }
            else if (el.id == "mtc") {
                novaAltura = (this.itemSelecionadoCenario.altura ? this.itemSelecionadoCenario.altura : this.itemTamanhoPadrao) - deltaY;
                if (novaAltura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.posicaoY = (this.itemSelecionadoCenario.posicaoY ? this.itemSelecionadoCenario.posicaoY : 0) + deltaY;
                    this.itemSelecionadoCenario.altura = novaAltura;
                }
            }
            else if (el.id == "mtr") {
                novaLargura = (this.itemSelecionadoCenario.largura ? this.itemSelecionadoCenario.largura : this.itemTamanhoPadrao) + deltaX;
                novaAltura = (this.itemSelecionadoCenario.altura ? this.itemSelecionadoCenario.altura : this.itemTamanhoPadrao) + deltaX;
                if (novaLargura >= this.itemTamanhoMinimo && novaAltura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.largura = novaLargura;
                    this.itemSelecionadoCenario.posicaoY = (this.itemSelecionadoCenario.posicaoY ? this.itemSelecionadoCenario.posicaoY : 0) - deltaX;
                    this.itemSelecionadoCenario.altura = novaAltura;
                }
            }
            else if (el.id == "mbl") {
                novaLargura = (this.itemSelecionadoCenario.largura ? this.itemSelecionadoCenario.largura : this.itemTamanhoPadrao) - deltaX;
                novaAltura = (this.itemSelecionadoCenario.altura ? this.itemSelecionadoCenario.altura : this.itemTamanhoPadrao) - deltaX;
                if (novaLargura >= this.itemTamanhoMinimo && novaAltura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.posicaoX = (this.itemSelecionadoCenario.posicaoX ? this.itemSelecionadoCenario.posicaoX : 0) + deltaX;
                    this.itemSelecionadoCenario.largura = novaLargura;
                    this.itemSelecionadoCenario.altura = novaAltura;
                }
            }
            else if (el.id == "mbc") {
                novaAltura = (this.itemSelecionadoCenario.altura ? this.itemSelecionadoCenario.altura : this.itemTamanhoPadrao) + deltaY;
                if (novaAltura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.altura = novaAltura;
                }
            }
            else if (el.id == "mbr") {
                novaLargura = (this.itemSelecionadoCenario.largura ? this.itemSelecionadoCenario.largura : this.itemTamanhoPadrao) + deltaX;
                novaAltura = (this.itemSelecionadoCenario.altura ? this.itemSelecionadoCenario.altura : this.itemTamanhoPadrao) + deltaX;
                if (novaLargura >= this.itemTamanhoMinimo && novaAltura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.largura = novaLargura;
                    this.itemSelecionadoCenario.altura = novaAltura;
                }
            }
            else if (el.id == "mcl") {
                novaLargura = (this.itemSelecionadoCenario.largura ? this.itemSelecionadoCenario.largura : this.itemTamanhoPadrao) - deltaX;
                if (novaLargura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.posicaoX = (this.itemSelecionadoCenario.posicaoX ? this.itemSelecionadoCenario.posicaoX : 0) + deltaX;
                    this.itemSelecionadoCenario.largura = novaLargura;
                }
            }
            else if (el.id == "mcr") {
                novaLargura = (this.itemSelecionadoCenario.largura ? this.itemSelecionadoCenario.largura : this.itemTamanhoPadrao) + deltaX;
                if (novaLargura >= this.itemTamanhoMinimo)
                {
                    this.itemSelecionadoCenario.largura = novaLargura;
                }
            }
        },
        adicionarCadeado() {
            // Adiciona um cadeado no cenário
            const cadeadoId = this.id + ".item" + (++this.idUnicoItem);
            this.listaCadeado.push({
                id: cadeadoId,
                tipo: this.tipoItem.CADEADO,
                nome: "",
                imagemFoco: "",
                tipoCadeado: this.tipoCadeado.NUMERICO,
                opcoesValores: ["0","1","2","3","4","5","6","7","8","9"],
                qtdDigitosSenha: 3,
                senha: ["", "", ""],
                largura: this.itemTamanhoPadrao,
                altura: this.itemTamanhoPadrao,
                posicaoX: 0,
                posicaoY: 0
            })
            this.$emit("itemAdicionado", { id: cadeadoId, tipo: this.tipoItem.CADEADO, cenarioId: this.id, nomeCenario: this.nomeCenario ? this.nomeCenario : this.id, nomeItem: cadeadoId, cenarioIdDestino: "" })
            this.itemSelecionadoCenario = this.listaCadeado[this.listaCadeado.length-1];
        },
        removerCadeado(cadeadoId) {
            if (confirm("Confirma a exclusão do cadeado?")) {
                // Remove um cadeado do cenário
                for (let i=0; i<this.listaCadeado.length; i++) {
                    if (this.listaCadeado[i].id === cadeadoId) {
                        this.listaCadeado.splice(i, 1);
                        this.$emit("itemRemovido", { id: cadeadoId, tipo: this.tipoItem.CADEADO })
                        break;
                    }
                }
                this.itemSelecionadoCenario = { id: "", tipo: "" };
            }
        },
        alterarOpcoesValoresTipoCadeado() {
            // Altera as opções de valores dependendo do tipo de cadeado
            if (this.itemSelecionadoCenario.tipoCadeado == this.tipoCadeado.NUMERICO) {
                this.itemSelecionadoCenario.opcoesValores = ["0","1","2","3","4","5","6","7","8","9"];
            } 
            else if (this.itemSelecionadoCenario.tipoCadeado == this.tipoCadeado.LETRA) {
                this.itemSelecionadoCenario.opcoesValores = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","W","Z"];
            }
            else if (this.itemSelecionadoCenario.tipoCadeado == this.tipoCadeado.SETA) {
                this.itemSelecionadoCenario.opcoesValores = ["Esquerda","Direita","Baixo","Cima"];
            }
            else {
                this.itemSelecionadoCenario.opcoesValores = [];
            }
            this.opcaoValorAdicionar = "";
            for (let i = 0; i < this.itemSelecionadoCenario.senha.length; i++) {
                this.itemSelecionadoCenario.senha[i] = "";
            }
        },
        alterarQtdDigitosSenhaCadeado() {
            // Altera a senha de acordo com a quantidade de dígitos
            if (this.itemSelecionadoCenario.senha.length < this.itemSelecionadoCenario.qtdDigitosSenha)
            {
                while (this.itemSelecionadoCenario.senha.length < this.itemSelecionadoCenario.qtdDigitosSenha) {
                    this.itemSelecionadoCenario.senha.push("");
                }
            }
            else if (this.itemSelecionadoCenario.senha.length > this.itemSelecionadoCenario.qtdDigitosSenha) {
                this.itemSelecionadoCenario.senha.splice(this.itemSelecionadoCenario.senha.length - this.itemSelecionadoCenario.qtdDigitosSenha - 1, this.itemSelecionadoCenario.senha.length - this.itemSelecionadoCenario.qtdDigitosSenha);
            }
        },
        imagemFocoCadeadoAlterada(e) {
            // Atualiza a visualização da imagem do cadeado
            const imagem = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(imagem);
            reader.onload = e => {
                this.itemSelecionadoCenario.imagemFoco = e.target.result;
            };
            e.target.value = "";
        },
        selecionarCorOpcoesValores(cor) {
            this.opcaoValorAdicionar = cor;
        },
        adicionarOpcaoValor() {
            // Adiciona um item nas opções de valores do cadeado
            if (this.opcaoValorAdicionar.trim() != "") {
                let existeOpcao = false;
                for (let i=0; i<this.itemSelecionadoCenario.opcoesValores.length; i++) {
                    if (this.itemSelecionadoCenario.opcoesValores[i].trim().toLowerCase() == this.opcaoValorAdicionar.trim().toLowerCase()) {
                        existeOpcao = true;
                        break;
                    }
                }
                if (!existeOpcao) {
                    this.itemSelecionadoCenario.opcoesValores.push(this.opcaoValorAdicionar);
                }
                this.opcaoValorAdicionar = "";
            }
        },
        removerOpcaoValor(opcao) {
            // Remove um item das opções de valores do cadeado
            for (let i=0; i<this.itemSelecionadoCenario.opcoesValores.length; i++) {
                if (this.itemSelecionadoCenario.opcoesValores[i].trim().toLowerCase() == opcao.trim().toLowerCase()) {
                    this.itemSelecionadoCenario.opcoesValores.splice(i, 1);
                    break;
                }
            }
            for (let i=0; i<this.itemSelecionadoCenario.senha.length; i++) {
                if (this.itemSelecionadoCenario.senha[i].trim().toLowerCase() == opcao.trim().toLowerCase()) {
                    this.itemSelecionadoCenario.senha[i] = "";
                }
            }
        },
        abrirOpcoesSelectCustomizado(selectId) {
            if (this.selectCustomizadoAberto == selectId) {
                this.selectCustomizadoAberto = "";
            }
            else {
                this.selectCustomizadoAberto = selectId;
            }
        },
        selecionarOpcaoSelectCustomizado(indice, opcao) {
            this.selectCustomizadoAberto = "";
            this.itemSelecionadoCenario.senha[indice] = opcao;
        },
        adicionarObjeto() {
            // Adiciona um objeto no cenário
            const objetoId = this.id + ".item" + (++this.idUnicoItem);
            this.listaObjeto.push({
                id: objetoId,
                tipo: this.tipoItem.OBJETO,
                nome: "",
                imagem: "",
                largura: this.itemTamanhoPadrao,
                altura: this.itemTamanhoPadrao,
                posicaoX: 0,
                posicaoY: 0
            })
            this.$emit("itemAdicionado", { id: objetoId, tipo: this.tipoItem.OBJETO, cenarioId: this.id, nomeCenario: this.nomeCenario ? this.nomeCenario : this.id, nomeItem: objetoId, listaObjetoRecipienteIdDestino: [], imagem: "" })
            this.itemSelecionadoCenario = this.listaObjeto[this.listaObjeto.length-1];
        },
        removerObjeto(objetoId) {
            if (confirm("Confirma a exclusão do objeto?")) {
                // Remove um objeto do cenário
                for (let i=0; i<this.listaObjeto.length; i++) {
                    if (this.listaObjeto[i].id === objetoId) {
                        this.listaObjeto.splice(i, 1);
                        this.$emit("itemRemovido", { id: objetoId, tipo: this.tipoItem.OBJETO })
                        break;
                    }
                }
                this.itemSelecionadoCenario = { id: "", tipo: "" };
            }
        },
        imagemObjetoAlterada(e) {
            // Atualiza a visualização da imagem do objeto
            const imagem = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(imagem);
            reader.onload = e => {
                this.itemSelecionadoCenario.imagem = e.target.result;
                this.$emit('imagemObjetoAlterada', { itemId: this.itemSelecionadoCenario.id, imagem: this.itemSelecionadoCenario.imagem });
            };
            e.target.value = "";            
        },
        existeRecipienteDestinoObjetoCenarios(objetoId) {
            // Verifica se o objeto foi selecionado como opção em algum recipiente, para não permitir remover
            for (let i=0; i<this.listaObjetoCenarios.length; i++) {
                if (this.listaObjetoCenarios[i].id === objetoId && this.listaObjetoCenarios[i].listaObjetoRecipienteIdDestino.length > 0) {
                    return true;
                }
            }
            return false;
        },
        adicionarObjetoRecipiente() {
            // Adiciona um recipiente de objeto no cenário
            const objetoRecipienteId = this.id + ".item" + (++this.idUnicoItem);
            this.listaObjetoRecipiente.push({
                id: objetoRecipienteId,
                tipo: this.tipoItem.OBJETO_RECIPIENTE,
                nome: "",
                objetos: [],
                largura: this.itemTamanhoPadrao,
                altura: this.itemTamanhoPadrao,
                posicaoX: 0,
                posicaoY: 0
            });
            this.itemSelecionadoCenario = this.listaObjetoRecipiente[this.listaObjetoRecipiente.length-1];
        },
        removerObjetoRecipiente(objetoRecipienteId) {
            if (confirm("Confirma a exclusão do recipiente de objeto?")) {
                // Remove um recipiente de objeto do cenário
                for (let i=0; i<this.listaObjetoRecipiente.length; i++) {
                    if (this.listaObjetoRecipiente[i].id === objetoRecipienteId) {
                        this.listaObjetoRecipiente.splice(i, 1);
                        break;
                    }
                }
                this.itemSelecionadoCenario = { id: "", tipo: "" };
            }
        },
        verificaObjetoRecipienteSelecionado(objetoId) {
            // Verifica se o objeto está na lista de opções de objeto selecionadas do recipiente
            for (let i=0; i<this.itemSelecionadoCenario.objetos.length; i++) {
                if (this.itemSelecionadoCenario.objetos[i] === objetoId) {
                    return true;
                }
            }
            return false;
        },
        alterarObjetoRecipiente(e) {
            // Adiciona ou remove um objeto da lista de opções de objeto selecionadas do recipiente
            if (e.target.checked) {
                this.itemSelecionadoCenario.objetos.push(e.target.value);
            }
            else {
                for (let i=0; i<this.itemSelecionadoCenario.objetos.length; i++) {
                    if (this.itemSelecionadoCenario.objetos[i] === e.target.value) {
                        this.itemSelecionadoCenario.objetos.splice(i, 1);
                        break;
                    }
                }
            }
            this.$emit('objetoRecipienteAlterado', { objetoRecipienteId: this.itemSelecionadoCenario.id, objetoId: e.target.value, objetoSelecionado: e.target.checked })
        },
        retornarImagemObjeto(objetoId) {
            // Retorna a imagem de um objeto para mostrar no recipiente
            for (let i=0; i<this.listaObjetoCenarios.length; i++) {
                if (this.listaObjetoCenarios[i].id === objetoId) {
                    return this.listaObjetoCenarios[i].imagem;
                }
            }
            return "";
        },
        existeGrupoRecipiente(objetoRecipienteId) {
            // Verifica se o recipiente de objeto foi selecionado como opção em algum grupo, para não permitir remover
            for (let i=0; i<this.listaGrupoRecipiente.length; i++) {
                for (let j=0; j<this.listaGrupoRecipiente[i].recipientes.length; j++){
                    if (this.listaGrupoRecipiente[i].recipientes[j] === objetoRecipienteId) {
                        return true;
                    }
                }        
            }
            return false;
        },
        adicionarGrupoRecipiente() {
            // Adiciona um grupo de recipiente no cenário
            const grupoRecipienteId = this.id + ".item" + (++this.idUnicoItem);
            this.listaGrupoRecipiente.push({
                id: grupoRecipienteId,
                tipo: this.tipoItem.GRUPO_RECIPIENTE,
                nome: "",
                imagemFoco: "",
                recipientes: []
            })
            this.$emit("itemAdicionado", { id: grupoRecipienteId, tipo: this.tipoItem.GRUPO_RECIPIENTE, cenarioId: this.id, nomeCenario: this.nomeCenario ? this.nomeCenario : this.id, nomeItem: grupoRecipienteId, cenarioIdDestino: "" })
            this.itemSelecionadoCenario = this.listaGrupoRecipiente[this.listaGrupoRecipiente.length-1];
        },
        removerGrupoRecipiente(grupoRecipienteId) {
            if (confirm("Confirma a exclusão do grupo de recipiente?")) {
                // Remove um grupo de recipiente do cenário
                for (let i=0; i<this.listaGrupoRecipiente.length; i++) {
                    if (this.listaGrupoRecipiente[i].id === grupoRecipienteId) {
                        this.listaGrupoRecipiente.splice(i, 1);
                        this.$emit("itemRemovido", { id: grupoRecipienteId, tipo: this.tipoItem.GRUPO_RECIPIENTE })
                        break;
                    }
                }
                this.itemSelecionadoCenario = { id: "", tipo: "" };
            }
        },
        imagemFocoGrupoRecipienteAlterada(e) {
            // Atualiza a visualização da imagem do grupo de recipiente
            const imagem = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(imagem);
            reader.onload = e => {
                this.itemSelecionadoCenario.imagemFoco = e.target.result;
            };
            e.target.value = "";
        },
        filtrarObjetoRecipiente(item) {
            // Exibe como opção de recipiente para um grupo apenas os itens que
            // ainda não foram utilizados como opção em outro grupo ou já está selecionado no próprio grupo
            for (let i=0; i<this.listaGrupoRecipiente.length; i++) {
                for (let j=0; j<this.listaGrupoRecipiente[i].recipientes.length; j++){
                    if (this.listaGrupoRecipiente[i].recipientes[j] === item.id) {
                        return this.listaGrupoRecipiente[i].id == this.itemSelecionadoCenario.id;
                    }
                }        
            }
            return true;
        },
        verificaGrupoRecipienteSelecionado(objetoRecipienteId) {
            // Verifica se o recipiente de objeto está na lista de opções de recipiente selecionadas do grupo
            for (let i=0; i<this.itemSelecionadoCenario.recipientes.length; i++) {
                if (this.itemSelecionadoCenario.recipientes[i] === objetoRecipienteId) {
                    return true;
                }
            }
            return false;
        },
        alterarRecipienteGrupo(e) {
            // Adiciona ou remove um recipiente da lista de opções de recipiente selecionadas do grupo
            if (e.target.checked) {
                this.itemSelecionadoCenario.recipientes.push(e.target.value);
            }
            else {
                for (let i=0; i<this.itemSelecionadoCenario.recipientes.length; i++) {
                    if (this.itemSelecionadoCenario.recipientes[i] === e.target.value) {
                        this.itemSelecionadoCenario.recipientes.splice(i, 1);
                        break;
                    }
                }
            }
        },
        adicionarCenarioFilho() {
            // Adiciona um cenário filho no cenário
            const cenarioFilhoId = this.id + ".item" + (++this.idUnicoItem);
            this.listaCenarioFilho.push({
                id: cenarioFilhoId,
                tipo: this.tipoItem.CENARIO_FILHO,
                nome: "",
                imagemFoco: "",
                largura: this.itemTamanhoPadrao,
                altura: this.itemTamanhoPadrao,
                posicaoX: 0,
                posicaoY: 0
            })
            this.$emit("itemAdicionado", { id: cenarioFilhoId, tipo: this.tipoItem.CENARIO_FILHO, cenarioId: this.id, nomeCenario: this.nomeCenario ? this.nomeCenario : this.id, nomeItem: cenarioFilhoId, cenarioIdDestino: "" })
            this.itemSelecionadoCenario = this.listaCenarioFilho[this.listaCenarioFilho.length-1];
        },
        removerCenarioFilho(cenarioFilhoId) {
            if (confirm("Confirma a exclusão do cenário filho?")) {
                // Remove um cenário filho do cenário
                for (let i=0; i<this.listaCenarioFilho.length; i++) {
                    if (this.listaCenarioFilho[i].id === cenarioFilhoId) {
                        this.listaCenarioFilho.splice(i, 1);
                        this.$emit("itemRemovido", { id: cenarioFilhoId, tipo: this.tipoItem.CENARIO_FILHO })
                        break;
                    }
                }
                this.itemSelecionadoCenario = { id: "", tipo: "" };
            }
        },       
        imagemFocoCenarioFilhoAlterada(e) {
            // Atualiza a visualização da imagem do cenário filho
            const imagem = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(imagem);
            reader.onload = e => {
                this.itemSelecionadoCenario.imagemFoco = e.target.result;
            };
            e.target.value = "";
        },
        retornarSalvar() {
            return {
                id: this.id,
                inicial: this.inicial,
                listaItemOrigem: this.listaItemOrigem,
                final: this.final,
                nome: this.nomeCenario,
                imagem: this.imagemCenario,
                listaCadeado: this.listaCadeado,
                listaObjeto: this.listaObjeto,
                listaObjetoRecipiente: this.listaObjetoRecipiente,
                listaGrupoRecipiente: this.listaGrupoRecipiente,
                listaCenarioFilho: this.listaCenarioFilho
            }
        },
        carregarDadosSalvos(dados) {
            this.id = dados.id;
            this.inicial = dados.inicial;
            this.listaItemOrigem = dados.listaItemOrigem;
            this.final = dados.final;
            this.nomeCenario = dados.nome;
            this.imagemCenario = dados.imagem;
            this.listaCadeado = dados.listaCadeado;
            this.listaObjeto = dados.listaObjeto;
            this.listaObjetoRecipiente = dados.listaObjetoRecipiente;
            this.listaGrupoRecipiente = dados.listaGrupoRecipiente;
            this.listaCenarioFilho = dados.listaCenarioFilho;
            let idItem = 0;
            if (this.listaCadeado.length) {
                idItem = parseInt(this.listaCadeado[this.listaCadeado.length - 1].id.split('.')[1].replace(/item/g, ''));
                if (idItem > this.idUnicoItem) {
                    this.idUnicoItem = idItem;
                }
            }
            if (this.listaObjeto.length) {
                idItem = parseInt(this.listaObjeto[this.listaObjeto.length - 1].id.split('.')[1].replace(/item/g, ''));
                if (idItem > this.idUnicoItem) {
                    this.idUnicoItem = idItem;
                }
            }
            if (this.listaObjetoRecipiente.length) {
                idItem = parseInt(this.listaObjetoRecipiente[this.listaObjetoRecipiente.length - 1].id.split('.')[1].replace(/item/g, ''));
                if (idItem > this.idUnicoItem) {
                    this.idUnicoItem = idItem;
                }
            }
            if (this.listaGrupoRecipiente.length) {
                idItem = parseInt(this.listaGrupoRecipiente[this.listaGrupoRecipiente.length - 1].id.split('.')[1].replace(/item/g, ''));
                if (idItem > this.idUnicoItem) {
                    this.idUnicoItem = idItem;
                }
            }
            if (this.listaCenarioFilho.length) {
                idItem = parseInt(this.listaCenarioFilho[this.listaCenarioFilho.length - 1].id.split('.')[1].replace(/item/g, ''));
                if (idItem > this.idUnicoItem) {
                    this.idUnicoItem = idItem;
                }
            }
        }
    }
}
</script>

<style scoped>
    .cenario-area {
        width: 100%;
        height: 600px;
        overflow: scroll;
        border: 1px solid #bbb;
        position: relative;
    }
    .area-items, .area-marca-tamanho {
        position: absolute;
    }
    .area-fundo {
        width: 100%;
        height: 100%;
    }
    .marca-tamanho {
        z-index: 2;
        width: 8px;
        height: 8px;
        position: absolute;
        cursor: pointer;
        background: #ddd;
        border: 1px solid #555;
    }
    .imagem-preview {
        max-width: 100px;
        max-height: 100px;
    }
    .cadeado, .cenario-filho {
        width: 50px; 
        height: 50px; 
        border-radius: 50%;
        border: 3px solid #666;
        background-color: rgba(255 ,255 ,250, .3);
        box-shadow: 2px 2px 2px white;
        position: absolute;
        cursor: pointer;
    }
    .cadeado.selecionado, .objeto.selecionado, .cenario-filho.selecionado {
        border: 3px solid orange;
        background-color: rgba(255 ,255 ,0, .3);
        box-shadow: 2px 2px 2px #666;
    }
    .select-customizado {
        width: 150px;
        display: inline-grid;
        vertical-align: top;
    }
    .select-customizado .selecionado {
        border: 2px solid;
    }
    .select-customizado li {
        cursor: pointer;
    }
    .objeto {
        width: 50px; 
        height: 50px; 
        border: 3px solid #666;
        background-color: rgba(255 ,255 ,250, .3);
        box-shadow: 2px 2px 2px white;
        position: absolute;
        cursor: pointer;
    }
    .objeto img {
        width: 100%;
        height: 100%;
    }
    .objeto > div {
        width: 100%;
        height: 100%;
        position: absolute;
    }
    .objeto-recipiente {
        width: 50px; 
        height: 50px; 
        border: 3px solid #aaa;
        background-color: rgba(0 ,0 ,0, .1);
        box-shadow: 2px 2px 2px white;
        position: absolute;
        cursor: pointer;
    }
    .objeto-recipiente.selecionado {
        border: 3px solid red;
        background-color: rgba(255 ,255 ,0, .3);
        box-shadow: 2px 2px 2px #666;
    }
    .objeto-recipiente img {
        width: 100%;
        height: 100%;
    }
    .objeto-recipiente > div {
        width: 100%;
        height: 100%;
        position: absolute;
    }
    .itens-cenario .selecionado {
        background-color: yellow;
    }
</style> 