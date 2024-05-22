import Groq from 'groq-sdk'
import { fetchPost } from '@/core/utils/fetch'

/** *********** coze */
const baseUrl = 'https://api.coze.com/open_api/v2'

export async function createArticleSummaryCoze(id: string) {
  try {
    return await fetchPost(
      `${baseUrl}/chat`,
      {},
      {
        bot_id: '7369838133141307410',
        user: '29032201862555',
        query: `{'id': ${id} }`,
        stream: false,
      },
      {
        Authorization: `Bearer pat_JlwrYzgzdoAH0ONQTF98H0hE8QSC4pRSoqoLrl3D5FMS2WIbtr6uwFfybvIqmGqC`,
        Host: 'api.coze.com',
      },
    )
  }
  catch (error) {
    console.error(new Error('Request Failed'))
    return null
  }
}

/** *********** groq */
const groq = new Groq({
  apiKey: '',
})

const tips = `角色：你是一个内容总结大师；
技能：完整阅读文本内容，在完整保留文章主题的前提下将所有内容总结为一个 300 字以内的文本；
要求：
1. 总结文本不能超过 300 字；
2. 仅对文本进行总结，不得添加其他无关内容；
3. 确保总结内容完整且准确，能体现原文主要内容；
4. 回答必须使用中文，禁止使用其它语言
5. 如果文章包含英文内容，也需要全部转换为中文`

function groqRequest(content: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: tips,
      },
      {
        role: 'user',
        content,
      },
    ],
    model: 'mixtral-8x7b-32768',
    temperature: 0.3,
    stream: false,
  })
}

export async function createArticleSummary(content: string) {
  try {
    let idx: number = 0
    let success = false
    let res: string = ''

    while (!success) {
      if (idx > 5)
        return null

      const data = await groqRequest(content)
      success = data.choices?.length > 0

      if (success) {
        res = data.choices[0]?.message?.content || ''
        return res
      }

      idx++
    }
  }
  catch (error) {
    console.error(new Error('Request Failed'))
    return null
  }
}
