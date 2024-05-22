import { fetchPost } from '@/core/utils/fetch'

const baseUrl = 'https://api.juejin.cn'

function request(id: string) {
  return fetchPost(
    `${baseUrl}/content_api/v1/article/detail`,
    {},
    { article_id: id, need_theme: false },
  )
}

export async function getArticleContent(id: string) {
  try {
    let idx: number = 0
    let success = false
    let res: string = ''

    while (!success) {
      if (idx > 5)
        return null

      const data = await request(id)
      success = data.err_no === 0

      if (success) {
        res = data.data?.article_info.mark_content || ''
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
