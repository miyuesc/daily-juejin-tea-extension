<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  Button as AButton,
  Textarea as ATextarea,
  FormItem,
  List,
  ListItem,
  ListItemMeta,
  Modal,
  Notification,
  PageHeader,
  Popconfirm,
  Radio,
  RadioGroup,
  Spin,
} from '@arco-design/web-vue'
import { IconDelete, IconRefresh } from '@arco-design/web-vue/es/icon'

import type {
  JJForm,
  JJTeaContent,
  LinkItem,
  ProcessTabsResult,
} from '@/types'

import { fireRuntimeMsgListener } from '@/core/utils/messageBus'
import {
  articleContent,
  messageBody,
  messageHeader,
  tableContentGenerator,
  typeOps,
} from '@/core/utils/template'
import { setClipboardText } from '@/core/utils/tools'
import { getArticleContent } from '@/core/requests/juejin'
import { getStorage, setStorage } from '@/app/utils'

const type = (getStorage('message-type') as JJForm['type']) || 'frontend'
const jjForm = ref<JJForm>({
  type,
  links: [],
})
const onLoading = ref(false)
const onFormLoading = ref(false)
const onSummaryLoading = ref(false)
const hasSuccess = ref(false)
const modelVisible = ref(false)
const modelFormVisible = ref(false)
const modelSummaryVisible = ref(false)
const afternoonTeaContent = ref<JJTeaContent>({
  header: '',
  body: '',
  activities: [],
  post: '',
})
const modelForm = ref<Record<'link' | 'content' | 'type', string>>({
  type: 'post',
  link: '',
  content: '',
})
const summaryContent = computed(() => articleContent(jjForm.value.type, jjForm.value.links))

// 分类控制
function changeStorage() {
  setStorage('message-type', jjForm.value.type)
}
// 标签页信息
function getTabsInfo() {
  hasSuccess.value = false
  onLoading.value = true
  fireRuntimeMsgListener('getTabsInfo', '', (res: ProcessTabsResult) => {
    jjForm.value.links = res.links
    onLoading.value = false
  })
}
// 移除某个标签页
function removeLinkItem(idx: number) {
  Modal.warning({
    title: '删除该链接？',
    content: '删除后无法恢复，可以通过“查询标签页”重置该列表',
    onOk: () => jjForm.value.links.splice(idx, 1),
  })
}
// 重新生成指定文章短链
function reloadShortLink(idx: number) {
  const links = jjForm.value.links
  try {
    onLoading.value = true
    fireRuntimeMsgListener(
      'generateShortLink',
      [links[idx]],
      (res: any[]) => {
        if (!res[0])
          Notification.error('短链请求异常')
        links[idx].shortLink = res[0]
        onLoading.value = false
      },
    )
  }
  catch (e) {
    console.error(e)
    onLoading.value = false
  }
}

// 短链生成
async function generateShortLink() {
  try {
    onLoading.value = true
    fireRuntimeMsgListener(
      'generateShortLink',
      jjForm.value.links,
      (res: any[]) => {
        console.log('短链请求：', res)
        if (res?.some(i => i === null))
          Notification.error('部分短链请求存在异常，请点击右侧图标重新生成！')

        res.forEach((i, idx) => jjForm.value.links[idx].shortLink = i)
        hasSuccess.value = true
        onLoading.value = false
      },
    )
  }
  catch (e) {
    console.error(e)
    hasSuccess.value = false
    onLoading.value = false
  }
}

// 总结内容生成
async function generateSummaryContent() {
  modelSummaryVisible.value = true
  onSummaryLoading.value = true

  const { links } = jjForm.value
  const contents: string[] = []

  for (const linkItem of links) {
    const id = linkItem.link.split('/').at(-1) as string
    const data = await getArticleContent(id)
    linkItem.content = data || ''
    contents.push(data!)
  }

  fireRuntimeMsgListener('generateSummary', contents, (res: string[]) => {
    console.log('文章总结：', res)
    if (res?.some(i => !i))
      Notification.error('部分文章总结请求异常')

    res.forEach((i, idx) => links[idx].summary = i)

    modelSummaryVisible.value = true
    onSummaryLoading.value = false
  })
}
async function reloadSummary(idx: number) {
  onSummaryLoading.value = true
  const linkItem = jjForm.value.links[idx]
  if (!linkItem.content) {
    const id = linkItem.link.split('/').at(-1) as string
    linkItem.content = await getArticleContent(id) as string
  }

  fireRuntimeMsgListener('generateSummary', [linkItem.content], (res: string[]) => {
    if (!res[0])
      Notification.error('总结请求异常')
    linkItem.summary = res[0]
    onSummaryLoading.value = false
  })
}

// 下午茶内容生成
function generatorTeaContent() {
  const { type, links } = jjForm.value
  if (links.some(i => !i.shortLink)) {
    return Modal.warning({
      title: '提示',
      content: '部分短链没有生成，继续操作需要后续手动补全',
      hideCancel: false,
      renderToBody: false,
      maskStyle: { zIndex: 9999 },
      modalStyle: { zIndex: 9999 },
      onOk() {
        afternoonTeaContent.value.header = messageHeader(type)
        afternoonTeaContent.value.body = messageBody(links as Required<LinkItem>[])
        modelVisible.value = true
      },
    })
  }

  afternoonTeaContent.value.header = messageHeader(type)
  afternoonTeaContent.value.body = messageBody(links as Required<LinkItem>[])
  modelVisible.value = true
}

// 内容插入
function openFormModel(type: string) {
  modelForm.value = { link: '', content: '', type }
  modelFormVisible.value = true
}

// 保存插入信息
function submitForm(transform = false) {
  if (!modelForm.value.content || !modelForm.value.link)
    return Notification.error('信息不完整')

  onFormLoading.value = true

  if (transform) {
    fireRuntimeMsgListener(
      'generateShortLink',
      [{ link: modelForm.value.link }],
      (res: any[]) => {
        onLoading.value = false
        if (!res || !res.length)
          return Notification.error('请求异常')

        modelForm.value.link = res[0].data?.link?.url ?? modelForm.value.link
        setMessagePart()
      },
    )
  }
  else {
    setMessagePart()
  }
}
function setMessagePart() {
  if (modelForm.value.type === 'post') {
    afternoonTeaContent.value.post = `${modelForm.value.content}\n${modelForm.value.link}`
  }
  else {
    if (!afternoonTeaContent.value.activities)
      afternoonTeaContent.value.activities = []

    afternoonTeaContent.value.activities.push(
      `${modelForm.value.content}\n${modelForm.value.link}`,
    )
  }
  onFormLoading.value = false
  modelFormVisible.value = false
}

// 复制
async function copyToClipboard(type: 'text' | 'table' | 'summary') {
  const { header, activities, post, body } = afternoonTeaContent.value
  let text = ''
  if (type === 'table') {
    text = tableContentGenerator(jjForm.value.links as Required<LinkItem>[])
  }
  else if (type === 'text') {
    text = `${header}\n`
    post && (text += `【每日掘金】\n${post}\n`)
    activities
    && activities.length
    && (text += `【近期活动】\n${(activities || []).join('\n')}\n`)
    text += body
  }
  else {
    text = summaryContent.value
  }

  await setClipboardText(text)

  if (type === 'table') {
    window.open(
      'https://bytedance.feishu.cn/sheets/shtcn6eVLKMUE5FFfnoLFYfPEOw',
      '__blank',
    )
  }
}
</script>

<template>
  <div class="crx-jj-mask">
    <div class="crx-jj-container" @click.stop>
      <Spin :loading="onLoading" dot style="width: 100%">
        <PageHeader
          :show-back="false"
          title="每日掘金"
          subtitle="掘金酱的下午茶"
        />
        <form :model="jjForm" class="jj-tea-form">
          <FormItem label="分类">
            <RadioGroup
              v-model="jjForm.type"
              type="button"
              @change="changeStorage"
            >
              <Radio v-for="op in typeOps" :key="op.value" :value="op.value">
                {{ op.label }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="链接">
            <List style="width: 100%" size="small">
              <ListItem v-for="(link, idx) in jjForm.links" :key="idx">
                <ListItemMeta :title="link.title" :description="link.link" />
                <template #actions>
                  <IconDelete @click="removeLinkItem(idx)" />
                </template>
              </ListItem>
              <template #footer>
                <div class="a-button a-button-long" @click="getTabsInfo">
                  查询文章标签页
                </div>
                <div
                  v-show="jjForm.links.length"
                  class="a-button a-button-long"
                  @click="generateShortLink"
                >
                  生成短链
                </div>
              </template>
            </List>
          </FormItem>
          <FormItem v-if="hasSuccess" label="短链">
            <List style="width: 100%" size="small">
              <ListItem v-for="(link, idx) in jjForm.links" :key="idx">
                <ListItemMeta
                  :title="link.title"
                  :description="link.shortLink"
                />
                <template #actions>
                  <IconRefresh v-show="!link.shortLink" @click="reloadShortLink(idx)" />
                </template>
              </ListItem>
              <template
                v-if="hasSuccess && jjForm.links.length"
                #footer
              >
                <div
                  class="a-button a-button-long"
                  @click="generatorTeaContent"
                >
                  生成下午茶消息
                </div>
                <div class="a-button a-button-long" @click="generateSummaryContent">
                  生成每日掘金文章内容
                </div>
              </template>
            </List>
          </FormItem>
        </form>
      </Spin>

      <Modal
        v-model:visible="modelVisible"
        title="下午茶"
        width="40vw"
        :modal-style="{ maxWidth: '640px' }"
        :footer="false"
        :render-to-body="false"
      >
        <Spin :loading="onSummaryLoading" dot>
          <pre>{{ afternoonTeaContent.header }}</pre>
          <pre v-if="afternoonTeaContent.post">{{
            `【每日掘金】\n${afternoonTeaContent.post}`
          }}</pre>
          <div v-else>
            <AButton type="text" @click="openFormModel('post')">
              插入每日掘金文章
            </AButton>
          </div>
          <pre v-if="afternoonTeaContent.activities?.length">{{
              `【近期活动】\n${(afternoonTeaContent.activities || []).join("\n")}`
          }}</pre>
          <div>
            <AButton type="text" @click="openFormModel('activity')">
              插入活动消息
            </AButton>
          </div>
          <pre>{{ afternoonTeaContent.body }}</pre>
          <div class="form-footer align-right">
            <div class="a-button" @click="copyToClipboard('text')">
              复制文本信息
            </div>
            <div class="a-button" @click="copyToClipboard('table')">
              复制到飞书
            </div>
          </div>
        </Spin>
      </Modal>

      <Modal
        v-model:visible="modelFormVisible"
        title="插入信息"
        :render-to-body="false"
        :footer="false"
      >
        <Spin :loading="onFormLoading" dot style="width: 100%">
          <form :model="modelForm" class="jj-tea-form">
            <FormItem label="内容">
              <ATextarea v-model="modelForm.content" allow-clear />
            </FormItem>
            <FormItem label="链接">
              <ATextarea v-model="modelForm.link" allow-clear />
            </FormItem>
          </form>
          <div class="form-footer align-right">
            <div class="a-button" @click="submitForm(true)">
              转为短链插入
            </div>
            <div class="a-button" @click="submitForm()">
              直接插入
            </div>
          </div>
        </Spin>
      </Modal>

      <Modal
        v-model:visible="modelSummaryVisible"
        title="每日掘金文章内容"
        width="80vw"
        :modal-style="{ maxWidth: '1000px' }"
        :render-to-body="false"
        :footer="false"
      >
        <Spin :loading="onSummaryLoading" dot>
          <div style="max-height: 80vh; overflow-y: auto;">
            <List style="width: 100%;" size="small">
              <template #header>
                <h3>{{ typeOps.find(i => i.value === jjForm.type)?.label }}</h3>
              </template>
              <ListItem v-for="(link, idx) in jjForm.links" :key="idx">
                <ListItemMeta
                  :title="`📗${link.title}`"
                  :description="link.summary"
                />
                <template #actions>
                  <Popconfirm v-if="link.summary" content="确定重新生成总结?" type="warning" @ok="reloadSummary(idx)">
                    <IconRefresh />
                  </Popconfirm>
                  <IconRefresh v-else @click="reloadSummary(idx)" />
                </template>
              </ListItem>
            </List>
          </div>
          <div class="form-footer align-right" style="padding-top: 20px">
            <div class="a-button" @click="copyToClipboard('summary')">
              复制
            </div>
          </div>
        </Spin>
      </Modal>
    </div>
  </div>
</template>
