import { guildApi, type ClientApi, type ResponseMessage } from "../qq-api";
import type {
  BookMarkClientProps,
  BookMarkProperties,
} from "../notion-api/book-mark-properties-map";
import { useTemplate } from "../utils";
import { DEFAULT_DIRECTIVE, Directives } from "./types";
import { parseEntities } from "parse-entities";
import { c2cApi } from "../qq-api/c2c-api";
import type { MessageReference } from "qq-guild-bot";

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

export type MessageContext = {
  contextId: string;
  messageId: string;
  messageReference?: MessageReference;
};

export function getMessageContext({
  msg,
  eventType,
}: {
  eventType: string;
  eventId: string;
  msg: ResponseMessage;
}): { messageContext: MessageContext; clientApi: ClientApi } {
  switch (eventType) {
    // 库没有提供 enum，参考 https://bot.q.qq.com/wiki/develop/nodesdk/wss/model.html

    // 频道中发送新的消息
    case "MESSAGE_CREATE": {
      return {
        clientApi: guildApi,
        messageContext: {
          // 回复时的上下文 id，频道中为 channelId，群聊中为 groupOpenId，私聊中为 openId
          contextId: msg.channel_id,
          messageId: msg.id,
          messageReference: msg.message_reference,
        },
      };
    }

    // 私聊中发送新的消息
    // FIXME: 私聊 api 中不支持转发
    // https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/send-receive/send.html#%E5%8D%95%E8%81%8A
    case "C2C_MESSAGE_CREATE": {
      return {
        clientApi: c2cApi,
        messageContext: {
          contextId: msg.author.id,
          messageId: msg.id,
        },
      };
    }

    default:
      throw new Error(`不支持的消息类型：${eventType}`);
  }
}

export function analyserDirect(content: string) {
  const instructions = content.trim();

  const regexpMap = {
    atAndDirectAndContent:
      /^<@!(?<atUserId>\d+?)>(\s)\/(?<direct>.+?)(\s)(?<content>.*)/,
    atAndDirect: /^<@!(?<atUserId>\d+?)>(\s)\/(?<direct>.+)/,
    onlyAt: /^<@!(?<atUserId>\d+?)>(\s*)(?<content>.*)/,
    onlyDirectAndNoAt: /^\/(?<direct>.+?)\s$/,
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

  if (regexpMap.onlyDirectAndNoAt.test(instructions)) {
    throw new Error("指令需要带上 @");
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
  context: MessageContext,
  { safetyPostMessage }: ClientApi
): asserts context is Required<MessageContext> {
  if (!context.messageReference?.message_id) {
    const errorMsg = "该指令必须包含一个消息引用";

    safetyPostMessage({
      message: errorMsg,
      contextId: context.contextId,
      referId: context.messageId,
    });

    throw new Error(errorMsg);
  }
}

export function notSupportMessageGuardian(
  context: MessageContext,
  content: string,
  { safetyPostMessage }: ClientApi
) {
  const errorMsg = "当前版本不支持该消息类型，请使用最新版本手机QQ查看";

  if (content.includes(errorMsg)) {
    safetyPostMessage({
      message: errorMsg,
      contextId: context.contextId,
      referId: context.messageId,
    });

    throw new Error(errorMsg);
  }
}

export const likeMessageTemplate = useTemplate`\n已创建收藏：${"notionPageId"}\n\n回复本信息并添加指令执行更多操作喵~`;
