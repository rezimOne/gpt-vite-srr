// `usePageContext` allows us to access `pageContext` in any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import { PageContext } from './types'

const key: InjectionKey<PageContext> = Symbol()

export function usePageContext() {
  const pageContext = inject(key)
  //console.log('usePageContext pageContext: ', pageContext)
  if (!pageContext) throw new Error('setPageContext() not called in parent')
  return pageContext
}

export function setPageContext(app: App, pageContext: PageContext) {
  //console.log('usePageContext.ts hook setPageContext pageContext: ', pageContext)
  app.provide(key, pageContext)
}
