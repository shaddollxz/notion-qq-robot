import { safetyPostMessageToChannel } from "../api";
import { formatDateStr } from "../utils";
import { Directives } from "./types";

export type MessageContentInfo = {
  atUserId?: string;
  direct: Directives;
  content: string;
};

export function handleInstructions(instructions: string) {
  const regexpMap = {
    atAndDirect:
      /^<@!(?<atUserId>\d+?)>(\s*)\/(?<direct>.+?)(\s*)(?<content>.*)/,
    onlyAt: /^<@!(?<atUserId>\d+?)>(\s*)(?<content>.*)/,
  };

  if (regexpMap.atAndDirect.test(instructions)) {
    return instructions.match(regexpMap.atAndDirect)!
      .groups as MessageContentInfo;
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

export function referenceMessageGuardian(
  channelId: string,
  msg: { message_id: string } | undefined
): asserts msg is { message_id: string } {
  if (!msg?.message_id) {
    const errorMsg = "该指令必须包含一个消息引用";
    safetyPostMessageToChannel({ message: errorMsg, channelId });

    const errorHistory = `[${formatDateStr}]: ${errorMsg} -- ${JSON.stringify(
      msg
    )}`;

    throw new Error(errorHistory);
  }
}
