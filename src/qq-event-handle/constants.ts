import { useTemplate } from "../utils";

export const ADDRESS_MAP = [
  { host: ["bilibili.com", "b23.tv"], name: "bilibili" },
  { host: ["xiaoheihe.cn"], name: "小黑盒" },
  { host: ["skyland.com"], name: "森空岛" },
  { host: ["github.com"], name: "github" },
  { host: ["pan.baidu.com"], name: "网盘" },
  { host: ["tieba.baidu.com"], name: "贴吧" },
  { host: ["zhihu.com"], name: "知乎" },
];

export const likeMessageTemplate = useTemplate`已创建收藏：${"notionPageId"}\n\n回复本信息并添加指令执行更多操作`;
