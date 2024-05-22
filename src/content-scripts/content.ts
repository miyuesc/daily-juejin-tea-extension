import type { App } from 'vue'
import { createApp } from 'vue'

import '@arco-design/web-vue/es/page-header/style/css.js'
import '@arco-design/web-vue/es/radio/style/css.js'
import '@arco-design/web-vue/es/textarea/style/css.js'
import '@arco-design/web-vue/es/list/style/css.js'
import '@arco-design/web-vue/es/form/style/css.js'
import '@arco-design/web-vue/es/modal/style/css.js'
import '@arco-design/web-vue/es/spin/style/css.js'
import '@arco-design/web-vue/es/popconfirm/style/css.js'
import '@arco-design/web-vue/es/notification/style/css.js'
import '@arco-design/web-vue/es/icon-component/style/css.js'

import appVue from '../app/App.vue'
import { setPanelStatus } from '@/core/store'
import '@/assets/styles/app.scss'
import type {
  MsgListener,
} from '@/core/utils/messageBus'
import {
  addRuntimeMsgListener,
  initMessageBus,
} from '@/core/utils/messageBus'

let app: null | App = null

export function toggle(visible: boolean) {
  setPanelStatus(visible)
  if (!visible) {
    app && app.unmount()
    app = null
  }
  else {
    const parent = document.querySelector('#__crx-app')
    if (!parent) {
      const juejinContent = document.querySelector('#__nuxt')
      juejinContent?.insertAdjacentHTML(
        'beforebegin',
        '<div id="__crx-app" class="__crx-app"></div>',
      )
    }
    app = createApp(appVue)
    app.mount('#__crx-app')
  }
}

const toggleListener: MsgListener = (request: any, _, sendResponse) => {
  toggle(request.body)
  sendResponse(request.body)
}

addRuntimeMsgListener('toggle', toggleListener)

initMessageBus()
