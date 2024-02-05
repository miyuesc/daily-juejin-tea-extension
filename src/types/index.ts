export type LinkItem = {
  title: string;
  link: string;
  shortLink?: string;
};
export type JJForm = {
  type: "frontend" | "backend" | "mobileend" | "ai";
  links: LinkItem[];
};
export type JJTeaContent = {
  header: string;
  body: string;
  activities?: string[];
  post?: string;
};

export type MessageItem = {
  title: string;
  shortLink: string;
};

export type ProcessTabsResult = {
  urls: string[];
  titles: string[];
  links: Array<Record<"title" | "link", string>>;
  tabs: chrome.tabs.Tab[];
};
export type ProcessTabsCallback = (res: ProcessTabsResult) => void;
