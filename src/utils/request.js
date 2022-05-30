// 基于axios封装请求函数
import ajax from 'axios'

const axios = ajax.create({
  timeout: 10000 // 超时时间
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params, // 即将与请求一起发送的 URL 参数
    data, // 发送给服务端的数据
    headers
  })
}