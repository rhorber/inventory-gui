import { Context, Plugin } from '@nuxt/types'
import { AxiosError, AxiosRequestConfig } from 'axios'

import { useRootStore } from '~/stores/root'

const httpUnauthorized = 401

const axiosPlugin: Plugin = function ({ $axios, $pinia, redirect }: Context): void {
  const store = useRootStore($pinia)

  $axios.onRequest((config: AxiosRequestConfig): void => {
    config.headers.common.Authorization = `Bearer ${store.accessToken}`
  })

  $axios.onError((error: AxiosError): void => {
    if (error.response && error.response.status === httpUnauthorized) {
      redirect('/login')
    }
  })
}

export default axiosPlugin
