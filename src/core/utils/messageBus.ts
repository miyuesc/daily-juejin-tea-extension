export type RuntimeMsg = {
  action: string;
  body?: unknown;
};
export type TabsMsg = {
  action: string;
  body?: unknown;
};

export type RuntimeMsgListener = (
  message: RuntimeMsg,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

export const runtimeListenersMap: Record<string, RuntimeMsgListener> = {};
export const tabsListenersMap: Record<string, Function> = {};

export const addRuntimeMsgListener = (
  action: string,
  listener: RuntimeMsgListener
) => {
  console.log(runtimeListenersMap);
  runtimeListenersMap[action] = listener;
};

export const fireRuntimeMsgListener = <T>(
  action: keyof typeof runtimeListenersMap,
  msg: RuntimeMsg,
  callback?: (res: T) => void
) => {
  // if (runtimeListenersMap[msg.action]) {
  chrome.runtime.sendMessage(msg, callback ?? (() => {}));
  // } else {
  //   console.warn(`${msg.action} not found!`);
  // }
};

export const addTabsMsgListener = (action: string, listener: Function) => {
  tabsListenersMap[action] = listener;
};

export const fireTabsMsgListener = <T>(
  msg: TabsMsg,
  callback?: (res: T) => void
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, msg, callback ?? (() => {}));
  });
};
