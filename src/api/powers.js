// 引入axios
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 获取可能有的token数据，进行请求头的设置，格式Authorization:token
  var token = localStorage.getItem('itcast_pro_token')
  // console.log(config)
  config.headers['Authorization'] = token

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 暴露asios
// 获取权限列表
export const userpower = (type) => {
  // 发送axios请求 进行登录验证
  return axios({
    url: `rights/${type}`,
    method: 'get',
  })
}
// 获取角色列表
export const roleuser = () => {
  // 发送axios请求 进行登录验证
  return axios({
    url: `roles`,
    method: 'get',
  })
}