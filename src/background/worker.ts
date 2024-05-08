import {
  addActionClickListener,
  addRuntimeMsgListener,
  fireTabsMsgListener,
  initMessageBus,
} from "@/core/utils/messageBus";
import {
  getStorage,
  setStorage,
  processJuejinPostTabs,
  processShortLink,
} from "@/core/utils/functions";

let newStatus = true;

// /////////// 侧边栏显示控制
export const toggleTab = () => {
  fireTabsMsgListener("toggle", newStatus);
  newStatus = !newStatus;
};
addActionClickListener(toggleTab);

// ///////////////////////// 消息事件
addRuntimeMsgListener("getTabsInfo", (request, sender, sendResponse) => {
  processJuejinPostTabs(sendResponse);
});

addRuntimeMsgListener("generateShortLink", (request, sender, sendResponse) => {
  processShortLink(request, sendResponse);
});

addRuntimeMsgListener("getStorage", (request, sender, sendResponse) => {
  getStorage(request, sendResponse);
});

addRuntimeMsgListener("setStorage", (request, sender, sendResponse) => {
  setStorage(request, sendResponse);
});

// 注册 worker 相关的事件监听器
initMessageBus();
