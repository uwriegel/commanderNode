import Vue from 'vue'
import Vuex from 'vuex'
import VueRx from 'vue-rx'
import App from './App.vue'
import MainMenu from 'vue-menubar'
import { getSize, getNameOnly, getExtension, getDateTime, getIconUrl, getVersion } from './pipes'
import { getSelectAll, getSelectNameOnly } from './directives'

Vue.config.productionTip = false

Vue.filter('size', getSize)
Vue.filter('nameOnly', getNameOnly)
Vue.filter('extension', getExtension)
Vue.filter('dateTime', getDateTime)
Vue.filter('iconUrl', getIconUrl)
Vue.filter('version', getVersion)
Vue.use(VueRx)
Vue.use(Vuex)
Vue.use(MainMenu)

Vue.directive('selectall', getSelectAll())
Vue.directive('select-name-only', getSelectNameOnly())

const store = new Vuex.Store({
    state: {
        showHidden: false,
        showViewer: false
    },
    mutations: {
        setShowHidden(state, showHidden) { state.showHidden = showHidden },
        setShowViewer(state, showViewer) { state.showViewer = showViewer }
    }
})

new Vue({
    render: h => h(App),
    store
}).$mount('#app')
