// 下载好了路由 配置的
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 引入login组件
import login from '@/views/login.vue';
import index from '@/views/index.vue';
import user from '@/views/users/User.vue';
import weicome from '@/views/users/weicome.vue';
// 创建路由模块
var router = new VueRouter({
  // 配置路由属性
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      redirect: { name: 'weicome' },
      children: [
        {
          path: 'weicome',
          name: 'weicome',
          component: weicome
        },
        {
          path: 'user',
          name: 'user',
          component: user
        }
      ]
    }
  ]
})

export default router