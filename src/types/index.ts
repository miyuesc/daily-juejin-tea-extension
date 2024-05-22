export interface LinkItem {
  title: string
  link: string
  shortLink?: string
  content?: string
  summary?: string
}
export interface JJForm {
  type: 'frontend' | 'backend' | 'mobileend' | 'ai'
  links: LinkItem[]
}
export interface JJTeaContent {
  header: string
  body: string
  activities?: string[]
  post?: string
}

export interface MessageItem {
  title: string
  shortLink: string
}

export interface ProcessTabsResult {
  urls: string[]
  titles: string[]
  links: Array<Record<'title' | 'link', string>>
  tabs: chrome.tabs.Tab[]
}
export type ProcessTabsCallback = (res: ProcessTabsResult) => void
