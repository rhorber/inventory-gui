import { Component } from 'vue'

export type HtmlAttrs = {
  class?: string | string[]
  style?: Record<string, number | string>
}

// Component is not typed by Buefy, but the alias is more meaningful.
export type BTableColumn = Component
