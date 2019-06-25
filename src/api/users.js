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
export const userlogin = (data) => {
  // 发送axios请求 进行登录验证
  return axios({
    url: 'login',
    method: 'post',
    data: data

  })
}
// 获取用户列表
export const getAllList = (params) => {
  return axios({
    url: 'users',
    params: params

  })
}
// 添加用户
export const addusers=(data)=>{
  return axios({
    url:'users',
    method: 'post',
    data:data
  })
}
// 编辑用户
export const editusers=(data)=>{
  return axios({
    url:`users/${data.id}`,
    method: 'put',
    data
  })
}
// 删除用户
export const delusers=(data)=>{
  return axios({
    url:`users/${data.id}`,
    method: 'delete',
  })
}
// 分配角色
export const allotusers=(data)=>{
  return axios({
    url:`users/${data.id}/role`,
    method:'put',
    data:data
  })
}
// 获取角色
export const getroles=()=>{
  return axios({
    url:`roles`,
    method:'get',
   
  })
}
// 修改用户状态
export const changusers=(uId,type)=>{
  return axios({
    url:`users/${uId}/state/${type}`,
    method: 'put',
  })
}