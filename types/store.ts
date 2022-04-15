import { CameraDevice } from 'html5-qrcode/core'

import { Article, Category } from '~/types/entities'

export type RootState = {
  accessToken: string | null
  articles: Article[] | null
  categories: Category[] | null
  isInventoryActive: boolean | null
  isSyncPending: boolean | null
  isSyncing: boolean
}

export type ScannerModuleState = {
  cameras: CameraDevice[] | undefined
  selectedCamera: string | undefined
}

export interface State extends RootState {
  scanner: ScannerModuleState
}

export type CategoryMap = {
  [categoryId: number]: Category
}

export type SyncItemParameter = {
  method: 'post' | 'put'
  url: string
  payload: Record<string, unknown>
}

export interface SyncItemStorage extends SyncItemParameter {
  timestamp: number
}

export { CameraDevice }
