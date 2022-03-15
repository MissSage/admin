
import axios from 'axios'
import { getToken } from '../cookies'

const _axios = axios.create({
  baseURL: import.meta.env.VITE_API_SCADAURL
})

_axios.interceptors.request.use(
  function (config) {
    const token = getToken()
    token && config.headers && (config.headers['X-Authorization'] = 'bearer' + token)
    return config
  }, function (error) {
    return Promise.reject(error)
  })

_axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})
export const request_scada = _axios
