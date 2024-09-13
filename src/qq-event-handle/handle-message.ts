import { getReferenceMessage, safetyPostMessageToChannel } from "../api";
import { Directives, type ResponseMessage } from "./types";
import { createBookMark } from "../notion-api/book-mark-data-base";
import {
  handleInstructions,
  referenceMessageGuardian,
  type MessageContentInfo,
} from "./utils";

export async function handleMessage({
  msg,
}: {
  eventType: string;
  eventId: string;
  msg: ResponseMessage;
}) {
  const messageContent = handleInstructions(msg.content);

  try {
    switch (messageContent.direct) {
      case Directives.Like: {
        return await handleLikeMessage(msg, messageContent);
      }
      case Directives.AutoLike: {
        return await handleAutoLikeMessage(msg, messageContent);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleAutoLikeMessage(
  { channel_id: channelId }: ResponseMessage,
  messageContent: MessageContentInfo
) {
  // TODO: 将信息处理后提交给 notion
  const res = await createBookMark({
    title: messageContent.content,
  });

  return safetyPostMessageToChannel({
    message: `接受到消息
指令: like
内容: ${messageContent.content}
已创建收藏: ${res.id}`,
    channelId,
  });
}

async function handleLikeMessage(
  { channel_id: channelId, message_reference }: ResponseMessage,
  messageContent: MessageContentInfo
) {
  referenceMessageGuardian(channelId, message_reference);

  const referenceMessage = await getReferenceMessage({
    channelId,
    referId: message_reference.message_id,
  });

  // TODO: 将信息处理后提交给 notion
  const res = await createBookMark({
    title: referenceMessage.content,
    description: messageContent.content,
  });

  return safetyPostMessageToChannel({
    message: `接受到消息
指令: like
回复内容: ${messageContent.content}
引用信息: ${referenceMessage.content}
已创建收藏: ${res.id}`,
    channelId,
  });
}
