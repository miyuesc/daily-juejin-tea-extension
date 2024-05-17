import { Notification } from "@arco-design/web-vue";
import { createShortLink } from "@/core/requests/xiaoma";
import { ProcessTabsCallback } from "@/types";
import { createArticleSummary } from "@/core/requests/coze";

export const storagePrefix = "jj-helper";

function formatTabs(tabs: chrome.tabs.Tab[]) {
  const urls: string[] = [];
  const titles: string[] = [];
  const links: Array<Record<"title" | "link", string>> = [];

  for (const tab of tabs) {
    const tabUrl = tab.url || "";
    const tabTitle = tab.title || "";
    const link = tabUrl.split("#")[0].split("?")[0];
    const title = tabTitle.replace(" - 掘金", "");

    if (!urls.includes(link)) {
      urls.push(link);
      titles.push(title);
      links.push({ title, link });
    }
  }

  return { urls, titles, links };
}

export const processJuejinPostTabs = (callback: ProcessTabsCallback) => {
  chrome.tabs.query(
    {
      url: ["https://juejin.cn/post/*"],
    },
    function (tabs) {
      const { urls, titles, links } = formatTabs(tabs);
      callback({ urls, titles, links, tabs });
    },
  );
};

export const processShortLink = async (request: any, sendResponse: any) => {
  try {
    const resArray = [];
    for (const linkItem of request.body) {
      const res = await createShortLink(linkItem.link);
      resArray.push(res);
    }
    sendResponse(resArray);
  } catch (e) {
    console.error(e);
    sendResponse(null);
  }
};

export const processSummary = async (request: any, sendResponse: any) => {
  try {
    const resArray = [];
    for (const linkItem of request.body) {
      const id = linkItem.split("/").at(-1);
      const { messages = [] } = await createArticleSummary(id);

      const res = messages.find((i: any) => i.type === "answer")?.content || "";

      resArray.push(res);
    }
    sendResponse(resArray);
  } catch (e) {
    console.error(e);
    sendResponse(null);
  }
};

export const copyContentToClipboard = async (
  request: any,
  sendResponse: any,
) => {
  try {
    const clipboardPermission = await chrome.permissions.contains({
      permissions: ["clipboardWrite"],
    });
    if (clipboardPermission) {
      if (!navigator.clipboard) {
        Notification.error("复制失败，请手动复制");
        sendResponse(false);
      }
      await navigator.clipboard.writeText(request.body as string);
      sendResponse(true);
    } else {
      sendResponse(false);
    }
  } catch (e) {
    console.error(e);
    sendResponse(false);
  }
};

export const getStorage = async (request: any, sendResponse: any) => {
  const { key } = request.body || {};
  const fullKey = `${storagePrefix}-${key}`;
  const result = await chrome.storage.local.get([fullKey]);
  sendResponse(result[fullKey]);
};

export const setStorage = async (request: any, sendResponse: any) => {
  if (request.body) {
    const newStorageData: any = {};
    for (const bodyKey in request.body) {
      newStorageData[`${storagePrefix}-${bodyKey}`] = request.body[bodyKey];
    }
    await chrome.storage.local.set(newStorageData);
  }
  sendResponse();
};
