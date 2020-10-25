<template>
    <div id="app">
        <h1>{{ sala.nome }}</h1>
        <form class="container-fluid">
            <div class="row">
                <div class="col-2">
                    <div class="relogio">Relógio</div>
                    <div class="objetos">Objetos</div>
                </div>
                <div class="col-10">
                    Cenario
                </div>
            </div>           
        </form>
        <div class="chat">
            Chat
        </div>
    </div>
</template>

<script>
import JsonTeste from './assets/teste.json'

export default {
    name: "Sessão",
    mounted() {
        this.sala = JsonTeste;
    },
    data: function() {
        return {
            sala: {}
        }
    }
}
</script>

<style>
    .chat {
        width: 100%;
        position: fixed;
        bottom: 0px;
        background-color: blue;
    }
    .relogio {
        background-color: black;
        color: red;
    }
    .objetos {
        border: 1px solid black;
    }
</style>