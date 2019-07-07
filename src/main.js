import Vue from 'vue'
import App from './App.vue'
import { getSize } from './pipes'

Vue.config.productionTip = false

Vue.filter('size', getSize)

new Vue({
    render: h => h(App),
}).$mount('#app')
