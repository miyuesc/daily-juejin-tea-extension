<template>
  <div class="crx-jj-mask" @click="closePanel">
    <div class="crx-jj-container" @click.stop>
      <spin :loading="onLoading" dot style="width: 100%">
        <page-header
          title="每日掘金"
          subtitle="掘金酱的下午茶"
          @back="closePanel"
        />
        <form :model="jjForm" class="jj-tea-form">
          <form-item label="分类">
            <radio-group
              v-model="jjForm.type"
              type="button"
              @update="changeStorage"
            >
              <radio v-for="op in typeOps" :key="op.value" :value="op.value">{{
                op.label
              }}</radio>
            </radio-group>
          </form-item>
          <form-item label="链接">
            <list style="width: 100%" size="small">
              <list-item v-for="(link, idx) in jjForm.links" :key="idx">
                <list-item-meta :title="link.title" :description="link.link" />
                <template #actions>
                  <icon-delete @click="removeLinkItem(idx)" />
                </template>
              </list-item>
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
            </list>
          </form-item>
          <form-item v-if="hasSuccess" label="短链">
            <list style="width: 100%" size="small">
              <list-item v-for="(link, idx) in jjForm.links" :key="idx">
                <list-item-meta
                  :title="link.title"
                  :description="link.shortLink"
                />
              </list-item>
              <template #footer>
                <div
                  v-if="hasSuccess"
                  class="a-button a-button-long"
                  @click="generatorTeaContent"
                >
                  生成下午茶消息
                </div>
              </template>
            </list>
          </form-item>
        </form>
      </spin>

      <modal
        v-model:visible="modelVisible"
        title="下午茶"
        :footer="false"
        :render-to-body="false"
      >
        <pre>{{ afternoonTeaContent.header }}</pre>
        <pre v-if="afternoonTeaContent.post">{{
          `【每日掘金】\n${afternoonTeaContent.post}`
        }}</pre>
        <div v-else>
          <a-button type="text" @click="openFormModel('post')"
            >插入每日掘金文章</a-button
          >
        </div>
        <pre
          v-if="
            afternoonTeaContent.activities &&
            afternoonTeaContent.activities.length
          "
          >{{
            `【近期活动】\n${(afternoonTeaContent.activities || []).join("\n")}`
          }}</pre
        >
        <div>
          <a-button type="text" @click="openFormModel('activity')"
            >插入活动消息</a-button
          >
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
      </modal>

      <modal
        v-model:visible="modelFormVisible"
        title="插入信息"
        :render-to-body="false"
        :footer="false"
      >
        <spin :loading="onFormLoading" dot style="width: 100%">
          <form :model="modelForm" class="jj-tea-form">
            <form-item label="内容">
              <a-textarea v-model="modelForm.content" allow-clear />
            </form-item>
            <form-item label="链接">
              <a-textarea v-model="modelForm.link" allow-clear />
            </form-item>
          </form>
          <div class="form-footer align-right">
            <div class="a-button" @click="submitForm">确认</div>
          </div>
        </spin>
      </modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  PageHeader,
  Radio,
  RadioGroup,
  List,
  ListItem,
  ListItemMeta,
  Form,
  FormItem,
  Modal,
  Notification,
  Spin,
  Textarea as ATextarea,
  Button as AButton,
} from "@arco-design/web-vue";
import { IconDelete } from "@arco-design/web-vue/es/icon";

import "@arco-design/web-vue/es/page-header/style/css.js";
import "@arco-design/web-vue/es/radio/style/css.js";
import "@arco-design/web-vue/es/textarea/style/css.js";
import "@arco-design/web-vue/es/list/style/css.js";
import "@arco-design/web-vue/es/form/style/css.js";
import "@arco-design/web-vue/es/modal/style/css.js";
import "@arco-design/web-vue/es/spin/style/css.js";
import "@arco-design/web-vue/es/notification/style/css.js";
import "@arco-design/web-vue/es/icon-component/style/css.js";

import { toggle } from "@/content-scripts/content";
import { fireRuntimeMsgListener } from "@/core/utils/messageBus";
import {
  messageBody,
  messageGenerator,
  messageHeader,
  tableContentGenerator,
} from "@/core/utils/template";
import { setClipboardText } from "@/core/utils/tools";

import type {
  JJForm,
  JJTeaContent,
  LinkItem,
  ProcessTabsResult,
} from "@/types";

const typeOps = [
  { label: "前端", value: "frontend" },
  { label: "后端", value: "backend" },
  { label: "移动端", value: "mobileend" },
  { label: "人工智能", value: "ai" },
];

const jjForm = ref<JJForm>({
  type: "frontend",
  links: [],
});
const onLoading = ref(false);
const hasSuccess = ref(false);
const modelVisible = ref(false);
const modelFormVisible = ref(false);
const onFormLoading = ref(false);
const afternoonTeaContent = ref<JJTeaContent>({
  header: "",
  body: "",
  activities: [],
  post: "",
});
const modelForm = ref<Record<"link" | "content" | "type", string>>({
  type: "post",
  link: "",
  content: "",
});

const getTabsInfo = () => {
  hasSuccess.value = false;
  onLoading.value = true;
  fireRuntimeMsgListener("getTabsInfo", undefined, (res: ProcessTabsResult) => {
    jjForm.value.links = res.links;
    onLoading.value = false;
  });
};

const removeLinkItem = (idx: number) => {
  Modal.warning({
    title: "删除该链接？",
    content: "删除后无法恢复，可以通过“查询标签页”重置该列表",
    onOk: () => jjForm.value.links.splice(idx, 1),
  });
};

const changeStorage = (value: string) => {
  console.log({ "message-type": value });
  fireRuntimeMsgListener("setStorage", { "message-type": value });
};

fireRuntimeMsgListener("getStorage", { key: "message-type" }, (res: any) => {
  jjForm.value.type = res || "frontend";
});

const generateShortLink = async () => {
  try {
    onLoading.value = true;
    fireRuntimeMsgListener(
      "generateShortLink",
      jjForm.value.links,
      (res: any[]) => {
        onLoading.value = false;
        if (!res || !res.length) {
          return Notification.error("请求异常");
        }
        for (let i = 0; i < res.length; i++) {
          const data = res[i];
          if (data && data.code === 0) {
            jjForm.value.links[i].shortLink = data.data?.link?.url ?? "";
          }
        }
        hasSuccess.value = true;
      },
    );
  } catch (e) {
    console.error(e);
    hasSuccess.value = false;
    onLoading.value = false;
  }
};

const generatorTeaContent = () => {
  const { type, links } = jjForm.value;
  afternoonTeaContent.value.header = messageHeader(type);
  afternoonTeaContent.value.body = messageBody(links as Required<LinkItem>[]);
  modelVisible.value = true;
};

const openFormModel = (type: string) => {
  modelForm.value = { link: "", content: "", type };
  modelFormVisible.value = true;
};
const submitForm = () => {
  if (!modelForm.value.content || !modelForm.value.link) {
    return Notification.error("信息不完整");
  }
  onFormLoading.value = true;
  if (!modelForm.value.link.includes("sourl.co")) {
    fireRuntimeMsgListener(
      "generateShortLink",
      [{ link: modelForm.value.link }],
      (res: any[]) => {
        onLoading.value = false;
        if (!res || !res.length) {
          return Notification.error("请求异常");
        }
        modelForm.value.link = res[0].data?.link?.url ?? modelForm.value.link;
        setMessagePart();
      },
    );
  } else {
    setMessagePart();
  }
};
const setMessagePart = () => {
  if (modelForm.value.type === "post") {
    afternoonTeaContent.value.post = `${modelForm.value.content}\n${modelForm.value.link}`;
  } else {
    if (!afternoonTeaContent.value.activities) {
      afternoonTeaContent.value.activities = [];
    }
    afternoonTeaContent.value.activities.push(
      `${modelForm.value.content}\n${modelForm.value.link}`,
    );
  }
  onFormLoading.value = false;
  modelFormVisible.value = false;
};

const copyToClipboard = async (type: "text" | "table") => {
  const { header, activities, post, body } = afternoonTeaContent.value;
  let text = "";
  if (type === "table") {
    text = tableContentGenerator(jjForm.value.links as Required<LinkItem>[]);
  }
  if (type === "text") {
    text = `${header}\n`;
    post && (text += `【每日掘金】\n${post}\n`);
    activities &&
      activities.length &&
      (text += `【近期活动】\n${(activities || []).join("\n")}\n`);
    text += body;
  }

  await setClipboardText(text);

  if (type === "table") {
    window.open(
      "https://bytedance.feishu.cn/sheets/shtcn6eVLKMUE5FFfnoLFYfPEOw",
      "__blank",
    );
  }
};

const closePanel = () => {
  // fireRuntimeMsgListener("toggle", { action: "toggle" });
  toggle(false);
};
</script>
