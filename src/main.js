import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from './api/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import "bpmn-js/dist/assets/diagram-js.css"
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css"
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$api = api


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
