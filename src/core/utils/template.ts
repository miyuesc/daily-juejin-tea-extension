// 下午茶消息内容
import type { JJForm, MessageItem } from "@/types";
import { typeLabelMap } from "@/core/utils/enums";

export const typeOps = [
  { label: "前端", value: "frontend" },
  { label: "后端", value: "backend" },
  { label: "移动端", value: "mobileend" },
  { label: "人工智能", value: "ai" },
];

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

// 每日掘金文章内容
export const articleContent = (
  type: JJForm["type"],
  content: JJForm["links"],
): string => {
  let md: string = `### ${typeOps.find((i) => i.value === type)?.label}`;

  content.forEach((item) => {
    md += `\n\r 📗[${item.title}](${item.shortLink})`;
    md += `\n\r > ${item.summary?.replace(/[\n\r`<>]/g, "")}`;
  });

  return md;
};
