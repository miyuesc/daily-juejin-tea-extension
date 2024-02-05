import {
  addRuntimeMsgListener,
  runtimeListenersMap,
  RuntimeMsg,
} from "@/core/utils/messageBus";
import {
  getStorage,
  setStorage,
  processJuejinPostTabs,
  processShortLink,
} from "@/core/utils/functions";
import { getPanelStatus, setPanelStatus } from "@/core/store";

// /////////// 侧边栏显示控制
const toggleTab = (tab?: chrome.tabs.Tab) => {
  const newStatus = !getPanelStatus();
  setPanelStatus(newStatus);
  chrome.tabs?.sendMessage(tab?.id!, { action: "toggle", body: newStatus });
};
chrome.action.onClicked.addListener(toggleTab);

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
chrome.runtime.onMessage.addListener(
  (message: RuntimeMsg, sender, sendResponse) => {
    if (runtimeListenersMap[message.action]) {
      runtimeListenersMap[message.action](message, sender, sendResponse);
    } else {
      sendResponse(null);
    }
    return true;
  }
);
