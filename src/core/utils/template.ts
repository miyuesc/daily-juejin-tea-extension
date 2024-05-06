// 下午茶消息内容
import type { MessageItem } from "@/types";
import { typeLabelMap } from "@/core/utils/enums";

export const msgItemGenerator = (
  idx: number,
  title: string,
  shortLink: string,
) => {
  return `${idx + 1}. ${title}
${shortLink}
`;
};

export const messageGenerator = (
  type: keyof typeof typeLabelMap,
  msgArr: MessageItem[],
) => {
  return `[咖啡]酱酱的${typeLabelMap[type]}下午茶来啦~
【今日干货】
${msgArr
  .map((msgItem, idx) =>
    msgItemGenerator(idx, msgItem.title, msgItem.shortLink),
  )
  .join("")}【总览 - 每日掘金】
https://sourl.co/iKiPJh`;
};

export const messageHeader = (type: keyof typeof typeLabelMap) => {
  return `[咖啡]酱酱的${typeLabelMap[type]}下午茶来啦~`;
};

export const messageBody = (msgArr: MessageItem[]) => {
  return `【今日干货】
${msgArr
  .map((msgItem, idx) =>
    msgItemGenerator(idx, msgItem.title, msgItem.shortLink),
  )
  .join("")}【总览 - 每日掘金】
https://sourl.co/iKiPJh`;
};

// 表格信息
export const tableItemGenerator = (item: MessageItem & { link: string }) => {
  return `${item.title} \t${item.shortLink} \t${item.link}
`;
};
export const tableContentGenerator = (
  msgArr: (MessageItem & { link: string })[],
) => {
  return `${msgArr.map((item) => tableItemGenerator(item)).join("")}`;
};
