import type { IMessage } from "qq-guild-bot";
import { safetyPostMessageToChannel } from "../api";
import type { Directives } from "./types";

export async function handleMessage(message: {
  eventType: string;
  eventId: string;
  msg: IMessage & {
    message_reference?: { message_id: string };
  };
}) {
  const { channel_id: channelId, content, message_reference } = message.msg;

  const messageContent = handleInstructions(content);

  if (!messageContent) return;

  switch (messageContent.direct) {
    // like 指令是默认指令
    case "like": {
      if (!message_reference) {
        const errorMsg = "该指令必须包含一个消息引用";
        safetyPostMessageToChannel({ message: errorMsg, channelId });

        return console.error(errorMsg);
      }

      // TODO: 将信息处理后提交给 notion
      safetyPostMessageToChannel({
        message: `接受到消息\n指令: like\n内容: ${messageContent.content}`,
        channelId,
      });
    }
  }
}

function handleInstructions(instructions: string) {
  if (
    /^<@!(?<robotId>\d+?)> \/(?<direct>.+?) (?<content>.*)/.test(instructions)
  ) {
    return instructions.match(
      /^<@!(?<robotId>\d+?)> \/(?<direct>.+?) (?<content>.*)/
    )!.groups as
      | {
          robotId: string;
          direct: Directives;
          content: string;
        }
      | undefined;
  } else {
    return {
      ...instructions.match(/^<@!(?<robotId>\d+?)> (?<content>.*)/)!.groups,
      direct: "like",
    } as
      | {
          robotId: string;
          direct: Directives;
          content: string;
        }
      | undefined;
  }
}
