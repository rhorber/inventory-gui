import { Context, Plugin } from '@nuxt/types'
import { AxiosError, AxiosRequestConfig } from 'axios'

const httpUnauthorized = 401

const axiosPlugin: Plugin = function ({ $axios, redirect, store }: Context): void {
  $axios.onRequest((config: AxiosRequestConfig): void => {
    config.headers.common.Authorization = `Bearer ${store.state.accessToken}`
  })

  $axios.onError((error: AxiosError): void => {
    if (error.response && error.response.status === httpUnauthorized) {
      redirect('/login')
    }
  })
}

export default axiosPlugin
