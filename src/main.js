import Vue from 'vue'
import App from './App.vue'
import { getSize, getNameOnly, getExtension, getDateTime } from './pipes'

Vue.config.productionTip = false

Vue.filter('size', getSize)
Vue.filter('nameOnly', getNameOnly)
Vue.filter('extension', getExtension)
Vue.filter('dateTime', getDateTime)

new Vue({
    render: h => h(App),
}).$mount('#app')
