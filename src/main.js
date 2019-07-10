import Vue from 'vue'
import VueRx from 'vue-rx'
import App from './App.vue'
import { getSize, getNameOnly, getExtension, getDateTime, getIconUrl } from './pipes'
import { getSelectAll } from './directives'

Vue.config.productionTip = false

Vue.filter('size', getSize)
Vue.filter('nameOnly', getNameOnly)
Vue.filter('extension', getExtension)
Vue.filter('dateTime', getDateTime)
Vue.filter('iconUrl', getIconUrl)
Vue.use(VueRx)

Vue.directive('selectall', getSelectAll())

new Vue({
    render: h => h(App),
}).$mount('#app')
