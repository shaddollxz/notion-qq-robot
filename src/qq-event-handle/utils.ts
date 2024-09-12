import type { IMessage } from "qq-guild-bot";
import { safetyPostMessageToChannel } from "../api";
import { formatDateStr } from "../utils";
import { Directives } from "./types";

export function handleInstructions(instructions: string) {
  const regexpMap = {
    atAndDirect: /^<@!(?<atUserId>\d+?)> \/(?<direct>.+?) (?<content>.*)/,
    onlyAt: /^<@!(?<atUserId>\d+?)> (?<content>.*)/,
  };

  if (regexpMap.atAndDirect.test(instructions)) {
    return instructions.match(regexpMap.atAndDirect)!.groups as {
      atUserId?: string;
      direct: Directives;
      content: string;
    };
  }

  if (regexpMap.onlyAt.test(instructions)) {
    return {
      ...instructions.match(regexpMap.onlyAt)!.groups,
      direct: Directives.Like,
    } as {
      atUserId?: string;
      direct: Directives;
      content: string;
    };
  }

  return {
    atUserId: undefined,
    direct: Directives.AutoLike,
    content: instructions,
  };
}

export function referenceMessageGuardian(
  channelId: string,
  msg: IMessage & {
    message_reference?: { message_id: string };
  }
) {
  if (!msg.message_reference) {
    const errorMsg = "该指令必须包含一个消息引用";
    safetyPostMessageToChannel({ message: errorMsg, channelId });

    const errorHistory = `[${formatDateStr}]: ${errorMsg} -- ${JSON.stringify(
      msg
    )}`;

    throw new Error(errorHistory);
  }
}
