import type { IMessage } from "qq-guild-bot";
import { safetyPostMessageToChannel } from "../api";
import type { BookMarkRow } from "../notion-api/book-mark-properties-map";
import { formatDateStr } from "../utils";
import { Directives, type ResponseMessage } from "./types";

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
    direct: Directives.AutoLike,
    content: instructions,
  };
}

export function analyserShareContent(contentStr: string) {
  const content = decodeURIComponent(contentStr);

  const regexpMap = {
    qqShare:
      /^\[.+?\](?<title>.+?)\s(?<description>.*?)\s(?<link>http(s?):\/\/.+?)\s.+?\s(?<from>.+)$/,
    linkWithText: /.*?(?<link>https?:\/\/[^\*]*?)[^\w|\/|\?|\=|#|&|.|-]/g,
  };

  if (regexpMap.qqShare.test(content)) {
    return content.match(regexpMap.qqShare)!.groups as unknown as BookMarkRow;
  }

  let row: BookMarkRow = {
    title: content,
    description: content,
  };

  if (regexpMap.linkWithText.test(content)) {
    const result = content.match(regexpMap.linkWithText)!.groups!;

    row = {
      title: result.link,
      link: result.link,
      description: content,
    };

    row.from = [
      { host: ["bilibili.com"], name: "哔哩哔哩" },
      { host: ["xiaoheihe.cn"], name: "小黑盒" },
      { host: ["skyland.com"], name: "森空岛" },
    ].reduce((acc, cur) => {
      if (acc) return acc;

      if (cur.host.some((url) => result.link.includes(url))) {
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
