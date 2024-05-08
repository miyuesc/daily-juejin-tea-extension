export type MsgListener = (
  message: RuntimeMsg,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => void;

export const runtimeListenersMap: Record<string, MsgListener> = {};
export type RuntimeMsg = {
  action: keyof typeof runtimeListenersMap;
  body?: unknown;
};

export const addRuntimeMsgListener = (
  action: string,
  listener: MsgListener,
  override?: boolean,
) => {
  if (!runtimeListenersMap[action]) {
    runtimeListenersMap[action] = listener;
    return;
  }
  override && (runtimeListenersMap[action] = listener);
};
export const fireRuntimeMsgListener = async <T>(
  action: RuntimeMsg["action"],
  body: RuntimeMsg["body"],
  callback?: (res: T) => void,
) => {
  if (!chrome?.runtime?.sendMessage) return;
  const response = await chrome.runtime.sendMessage({ action, body });
  callback?.(response);
};
export const removeRuntimeMsgListener = (action: string) => {
  if (!runtimeListenersMap[action]) return;
  delete runtimeListenersMap[action];
};

export const fireTabsMsgListener = async <T>(
  action: RuntimeMsg["action"],
  body: RuntimeMsg["body"],
  callback?: (res: T) => void,
) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id!, { action, body });
  callback?.(response);
};

//
export type ActionClickListener = (tab: chrome.tabs.Tab) => unknown | undefined;
export const actionClickListeners: ActionClickListener[] = [];
export const addActionClickListener = (listener: ActionClickListener) => {
  actionClickListeners.push(listener);
};

export const initMessageBus = () => {
  chrome.runtime?.onMessage.addListener(
    (message: RuntimeMsg, sender, sendResponse) => {
      if (runtimeListenersMap[message.action]) {
        runtimeListenersMap[message.action]?.(message, sender, sendResponse);
      } else {
        sendResponse(null);
      }
      return true;
    },
  );
  chrome.action?.onClicked.addListener((tab) => {
    for (const actionClickListener of actionClickListeners) {
      actionClickListener(tab);
    }
    return true;
  });
};
