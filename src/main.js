import Vue from 'vue'
import VDragged from 'v-dragged'
import App from './App.vue'
import AppSessao from './AppSessao.vue'

Vue.config.productionTip = false;
Vue.use(VDragged);

Vue.directive('focus-on-create', {
  bind: function(el) {
    window.setTimeout(function() { el.focus() }, 0);
  }
})

const routes = {
  '/': App,
  '/sessao': AppSessao
}

new Vue({
  render: h => h(routes[window.location.pathname])
}).$mount('#app')
