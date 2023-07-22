import { createSSRApp, defineComponent, h, computed, watch} from 'vue'
import PageShell from './PageShell.vue'
import medications from '../pages/medications/index.page.vue'
import { setPageContext } from './usePageContext'
import type { Component, PageContext, PageProps } from './types'
import useOpenAiApi from '../api/useOpenAIApi'

export function createApp(Page: Component, pageProps: PageProps | undefined, pageContext: PageContext) {
  //console.log('app.ts createApp() Page: ', Page);
  //console.log('app.ts createApp() pageContext: ', pageContext);
  const PageWithLayout = defineComponent({
    render() {
      return h(
        PageShell,
        {},
        {
          default() {
            return h(Page, pageProps || {})
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithLayout)

  // Make pageContext available from any Vue component
  setPageContext(app, pageContext)
  // if (pageContext.urlPathname ==='/chat'){
  //   useOpenAiApi().set('sessionStatus', true)
  // } else {
  // useOpenAiApi().set('sessionStatus', false)
  // }

  return app
}