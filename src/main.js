import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router.js';
// 引入element-ui组件配置
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 以内style中的index样式
import '@/styles/index.less';
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  // 挂载路由
  router,
  render: h => h(App)
}).$mount('#app')
