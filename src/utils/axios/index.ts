
import axios, { AxiosRequestConfig } from 'axios'
import { getToken } from '../cookies'
import { SLMessage } from '../global'

const _axios = axios.create({
  baseURL: String(import.meta.env.VITE_API_BASEURL)
})

_axios.interceptors.request.use(
  function (config) {
    const token = getToken()
    token && config.headers && (config.headers['X-Authorization'] = 'bearer ' + token)
    return config
  }, function (error) {
    return Promise.reject(error)
  })

_axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  let message = error.response?.data?.message || error.response?.message || error?.message
  const status = error.response?.data?.status || error.response?.status || error?.status
  switch (status) {
    case 404:
      message = '请求失败，资源未找到'
      break
    case 405:
      message = '当前请求方法不受支持'
      break
    default:
      break
  }
  SLMessage.error(message)
  return Promise.reject(error)
})
export const request = _axios
