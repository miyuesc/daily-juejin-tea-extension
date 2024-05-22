import { Notification } from '@arco-design/web-vue'

export async function setClipboardText(text: string) {
  if (!navigator.clipboard) {
    Notification.error('复制失败，请手动复制')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    Notification.success('复制成功')
  }
  catch (e) {
    Notification.error('复制失败，请手动复制')
  }
}
