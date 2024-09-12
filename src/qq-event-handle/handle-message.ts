import type { IMessage } from "qq-guild-bot";
import { safetyPostMessageToChannel } from "../api";
import { Directives } from "./types";
import { createBookMark } from "../notion-api/book-mark-data-base";
import { handleInstructions, referenceMessageGuardian } from "./utils";

export async function handleMessage(message: {
  eventType: string;
  eventId: string;
  msg: IMessage & {
    message_reference?: { message_id: string };
  };
}) {
  const { channel_id: channelId, content } = message.msg;

  const messageContent = handleInstructions(content);

  // 忽略全部为空格或者没有内容的消息
  if (/\S/.test(messageContent.content)) return;

  try {
    switch (messageContent.direct) {
      case Directives.Like: {
        referenceMessageGuardian(channelId, message.msg);

        // TODO: 将信息处理后提交给 notion
        const res = await createBookMark({
          title: messageContent.content,
        });

        safetyPostMessageToChannel({
          message: `接受到消息\n指令: like\n内容: ${messageContent.content}\n已创建收藏: ${res.id}`,
          channelId,
        });
      }
      case Directives.AutoLike: {
        // TODO: 将信息处理后提交给 notion
        const res = await createBookMark({
          title: messageContent.content,
        });

        safetyPostMessageToChannel({
          message: `接受到消息\n指令: like\n内容: ${messageContent.content}\n已创建收藏: ${res.id}`,
          channelId,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}
