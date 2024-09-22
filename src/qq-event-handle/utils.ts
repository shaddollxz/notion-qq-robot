import { safetyPostMessageToChannel, type ResponseMessage } from "../qq-api";
import type {
  BookMarkClientProps,
  BookMarkProperties,
} from "../notion-api/book-mark-properties-map";
import { formatDateStr, useTemplate } from "../utils";
import { DEFAULT_DIRECTIVE, Directives } from "./types";
import { parseEntities } from "parse-entities";

const ADDRESS_MAP = [
  { host: ["bilibili.com", "b23.tv"], name: "bilibili" },
  { host: ["xiaoheihe.cn"], name: "小黑盒" },
  { host: ["skyland.com"], name: "森空岛" },
  { host: ["github.com"], name: "github" },
  { host: ["pan.baidu.com"], name: "网盘" },
  { host: ["tieba.baidu.com"], name: "贴吧" },
  { host: ["zhihu.com"], name: "知乎" },
];

export type MessageContentInfo = {
  atUserId?: string;
  direct: Directives;
  content: string;
};

export function analyserDirect(content: string) {
  const instructions = content.trim();

  const regexpMap = {
    atAndDirectAndContent:
      /^<@!(?<atUserId>\d+?)>(\s)\/(?<direct>.+?)(\s)(?<content>.*)/,
    atAndDirect: /^<@!(?<atUserId>\d+?)>(\s)\/(?<direct>.+)/,
    onlyAt: /^<@!(?<atUserId>\d+?)>(\s*)(?<content>.*)/,
  };

  if (regexpMap.atAndDirectAndContent.test(instructions)) {
    return instructions.match(regexpMap.atAndDirectAndContent)!
      .groups as MessageContentInfo;
  }

  if (regexpMap.atAndDirect.test(instructions)) {
    return {
      ...(instructions.match(regexpMap.atAndDirect)!
        .groups as MessageContentInfo),
      content: "",
    };
  }

  if (regexpMap.onlyAt.test(instructions)) {
    return {
      ...instructions.match(regexpMap.onlyAt)!.groups,
      direct: Directives.Like,
    } as MessageContentInfo;
  }

  return {
    atUserId: undefined,
    direct: DEFAULT_DIRECTIVE,
    content: instructions,
  };
}

export function analyserShareContent(contentStr: string) {
  const content = parseEntities(decodeURIComponent(contentStr));

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

export function referenceMessageGuardian(
  handleMsg: ResponseMessage
): asserts handleMsg is Required<ResponseMessage> {
  if (!handleMsg.message_reference?.message_id) {
    const errorMsg = "该指令必须包含一个消息引用";

    safetyPostMessageToChannel({
      message: errorMsg,
      ...handleMsg,
    });

    const errorHistory = `[${formatDateStr}]: ${errorMsg} -- ${JSON.stringify(
      handleMsg
    )}`;

    throw new Error(errorHistory);
  }
}

export function notSupportMessageGuardian(
  msg: ResponseMessage,
  content: string
) {
  const errorMsg = "当前版本不支持该消息类型，请使用最新版本手机QQ查看";

  if (content.includes(errorMsg)) {
    safetyPostMessageToChannel({ message: errorMsg, ...msg });

    throw new Error(errorMsg);
  }
}

export const likeMessageTemplate = useTemplate`\n已创建收藏：${"notionPageId"}\n\n回复本信息并添加指令执行更多操作喵~`;
