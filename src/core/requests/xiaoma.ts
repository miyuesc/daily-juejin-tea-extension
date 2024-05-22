import { fetchPost } from '@/core/utils/fetch'

const baseUrl = 'https://api.xiaomark.com'

function request(originUrl: string) {
  return fetchPost(
    `${baseUrl}/v1/link/create`,
    {},
    {
      apikey: '',
      origin_url: originUrl,
      report: true,
      webhook: true,
      webhook_scene: 'test',
    },
  )
}

export async function createShortLink(originUrl: string) {
  try {
    let idx: number = 0
    let success = false
    let res: string = ''

    while (!success) {
      if (idx > 5)
        return null

      const data = await request(originUrl)
      success = data.code === 0

      if (success) {
        res = data.data?.link?.url ?? ''
        return res
      }

      idx++
    }
  }
  catch (error) {
    console.error(error)
    return null
  }
}
