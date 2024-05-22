import { createShortLink } from '@/core/requests/xiaoma'
import type { ProcessTabsCallback } from '@/types'
import { createArticleSummary } from '@/core/requests/coze'

function formatTabs(tabs: chrome.tabs.Tab[]) {
  const urls: string[] = []
  const titles: string[] = []
  const links: Array<Record<'title' | 'link', string>> = []

  for (const tab of tabs) {
    const tabUrl = tab.url || ''
    const tabTitle = tab.title || ''
    const link = tabUrl.split('#')[0].split('?')[0]
    const title = tabTitle.replace(' - 掘金', '')

    if (!urls.includes(link)) {
      urls.push(link)
      titles.push(title)
      links.push({ title, link })
    }
  }

  return { urls, titles, links }
}

export function processJuejinPostTabs(callback: ProcessTabsCallback) {
  chrome.tabs.query(
    {
      url: ['https://juejin.cn/post/*'],
    },
    (tabs) => {
      const { urls, titles, links } = formatTabs(tabs)
      callback({ urls, titles, links, tabs })
    },
  )
}

export async function processShortLink(request: any, sendResponse: any) {
  try {
    const resArray = []
    for (const linkItem of request.body) {
      const res = await createShortLink(linkItem.link)
      resArray.push(res)
    }
    sendResponse(resArray)
  }
  catch (e) {
    console.error(e)
    sendResponse(null)
  }
}

export async function processSummary(request: any, sendResponse: any) {
  try {
    const resArray = []
    for (const content of request.body) {
      const res = await createArticleSummary(content)
      resArray.push(res)
    }
    sendResponse(resArray)
  }
  catch (e) {
    console.error(e)
    sendResponse(null)
  }
}
