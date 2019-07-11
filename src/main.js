import Vue from 'vue'
import Vuex from 'vuex'
import VueRx from 'vue-rx'
import App from './App.vue'
import { getSize, getNameOnly, getExtension, getDateTime, getIconUrl, getVersion } from './pipes'
import { getSelectAll } from './directives'

Vue.config.productionTip = false

Vue.filter('size', getSize)
Vue.filter('nameOnly', getNameOnly)
Vue.filter('extension', getExtension)
Vue.filter('dateTime', getDateTime)
Vue.filter('iconUrl', getIconUrl)
Vue.filter('version', getVersion)
Vue.use(VueRx)
Vue.use(Vuex)

Vue.directive('selectall', getSelectAll())

const store = new Vuex.Store({
    state: {
        showHidden: false
    },
    mutations: {
        setShowHidden(state, showHidden) { state.showHidden = showHidden }
    }
})

new Vue({
    render: h => h(App),
    store
}).$mount('#app')
