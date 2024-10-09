import { parseEntities } from "parse-entities";
import {
  createBookMark,
  type BookMarkClientProps,
  type BookMarkProperties,
} from "@/notion-api";
import type { CustomError, DeepPartial } from "@/types";

export async function starCommand(
  msg: string,
  defaultProperties?: DeepPartial<BookMarkClientProps>
) {
  if (!msg) throw { postUser: true, msg: "没有输入内容" } as CustomError;

  const sharedData = analyserShareContent(msg);

  const bookMark: BookMarkClientProps = {
    properties: {
      ...defaultProperties?.properties,
      ...sharedData.properties,
      description:
        defaultProperties?.properties?.description ??
        sharedData.properties.description,
    },
    content: defaultProperties?.content,
  };

  const { id: notionPageId } = await createBookMark(bookMark);

  return notionPageId;
}

const ADDRESS_MAP = [
  { host: ["bilibili.com", "b23.tv"], name: "bilibili" },
  { host: ["xiaoheihe.cn"], name: "小黑盒" },
  { host: ["skyland.com"], name: "森空岛" },
  { host: ["github.com"], name: "github" },
  { host: ["pan.baidu.com"], name: "网盘" },
  { host: ["tieba.baidu.com"], name: "贴吧" },
  { host: ["zhihu.com"], name: "知乎" },
];

function analyserShareContent(contentStr: string) {
  const content = parseEntities(decodeURIComponent(contentStr.trim()));

  const regexpMap = {
    qqShare: /^\[.+?\](?<title>.+?)\s(.*?)\s(?<link>http(s?):\/\/.+?)\s.+?\s/,
    linkWithText:
      /(?<pre>.*?)\s?(?<link>https?:\/\/.+?)(\s|(?<suffix1>[^\w|\/|\?|\=|#|&|.|-]|$))(?<suffix2>.*)$/,
  };

  let row: BookMarkClientProps = {
    properties: {
      title: content,
    },
  };

  let matched = false;

  if (!matched && regexpMap.qqShare.test(content)) {
    matched = true;
    row.properties = content.match(regexpMap.qqShare)!
      .groups as unknown as BookMarkProperties;
  }

  if (!matched && regexpMap.linkWithText.test(content)) {
    matched = true;
    const result = content.match(regexpMap.linkWithText)!.groups!;

    row = {
      properties: {
        title: result.pre || `${result.suffix1 ?? ""}${result.suffix2}`,
        description: `${result.suffix1 ?? ""}${result.suffix2}`,
        link: result.link,
      },
      content,
    };
  }

  if (row.properties.link) {
    row.properties.from = ADDRESS_MAP.reduce((acc, cur) => {
      if (acc) return acc;

      if (cur.host.some((url) => row.properties.link!.includes(url))) {
        return cur.name;
      }

      return acc;
    }, "");
  }

  return row;
}
