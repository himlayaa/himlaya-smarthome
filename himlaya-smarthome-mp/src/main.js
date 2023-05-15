import Vue from 'vue'
import App from './App'
import store from './store/store.js'

Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'

mpvue.cloud.init({
    env: 'himlaya-mp-8g49yvhy2ecb4e2e',
    traceUser: true
  })

const app = new Vue({
    ...App,
    store
})

app.$mount()
