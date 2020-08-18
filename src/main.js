import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './font/iconfont.css'
import './plugins/axios'
import './plugins/rem'
Vue.use(MintUI)
Vue.config.productionTip = false
import global from './api/global.js'
Vue.prototype.Global = global
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
