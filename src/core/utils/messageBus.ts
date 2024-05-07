export type MsgListener = (
  message: RuntimeMsg,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => void;

export const runtimeListenersMap: Record<string, MsgListener[]> = {};
export type RuntimeMsg = {
  action: keyof typeof runtimeListenersMap;
  body?: unknown;
};

export const addRuntimeMsgListener = (
  action: string,
  listener: MsgListener,
) => {
  if (!runtimeListenersMap[action]) {
    runtimeListenersMap[action] = [];
  }
  runtimeListenersMap[action].push(listener);
};
export const fireRuntimeMsgListener = <T>(
  action: RuntimeMsg["action"],
  body: RuntimeMsg["body"],
  callback?: (res: T) => void,
) => {
  if (!chrome?.runtime?.sendMessage) return;
  chrome.runtime.sendMessage({ action, body }, (response) => {
    const res = callback?.(response);
    return res || true;
  });
};
export const removeRuntimeMsgListener = (
  action: string,
  listener?: MsgListener,
) => {
  if (!runtimeListenersMap[action]) return;
  if (!listener) return (runtimeListenersMap[action] = []);
  runtimeListenersMap[action] = runtimeListenersMap[action].filter(
    (fc) => fc === listener,
  );
};

export type TabsMsg = {
  action: keyof typeof tabsListenersMap;
  body?: unknown;
};
export const tabsListenersMap: Record<string, MsgListener[]> = {};
export const addTabsMsgListener = (action: string, listener: MsgListener) => {
  if (!tabsListenersMap[action]) {
    tabsListenersMap[action] = [];
  }
  tabsListenersMap[action].push(listener);
};
export const fireTabsMsgListener = <T>(
  msg: TabsMsg,
  callback?: (res: T) => void,
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, msg, (response) => {
      const res = callback?.(response);
      return res || true;
    });
  });
};

//
export type ActionClickListener = (
  tab: chrome.tabs.Tab,
) => Promise<unknown> | undefined;
export const ActionClickListeners: ActionClickListener[] = [];
export const addActionClickListener = (listener: ActionClickListener) => {
  ActionClickListeners.push(listener);
};

export const initMessageBus = () => {
  chrome.runtime?.onMessage.addListener(
    (message: RuntimeMsg, sender, sendResponse) => {
      if (runtimeListenersMap[message.action]) {
        runtimeListenersMap[message.action].forEach((fc) =>
          fc(message, sender, sendResponse),
        );
      } else {
        sendResponse(null);
      }
    },
  );
  chrome.action?.onClicked.addListener((tab) => {
    ActionClickListeners.forEach(async (fc) => await fc(tab));
  });
};
