import {
  getReferenceMessage,
  safetyPostMessageToChannel,
  type ResponseMessage,
} from "../../qq-api";
import { createBookMark } from "../../notion-api";
import {
  analyserShareContent,
  likeMessageTemplate,
  notSupportMessageGuardian,
  referenceMessageGuardian,
  type MessageContentInfo,
} from "../utils";

export async function handleLikeMessage(
  handleMsg: ResponseMessage,
  messageContent: MessageContentInfo
) {
  referenceMessageGuardian(handleMsg);

  const referenceMessage = await getReferenceMessage({
    channelId: handleMsg.channel_id,
    referId: handleMsg.message_reference.message_id,
  });

  notSupportMessageGuardian(handleMsg, referenceMessage.content);

  const sharedData = analyserShareContent(referenceMessage.content);

  const bookMark = sharedData
    ? {
        ...sharedData,
        description: messageContent.content || sharedData.description,
      }
    : {
        title: referenceMessage.content,
        description: messageContent.content,
      };

  const { id: notionPageId } = await createBookMark(bookMark);

  return safetyPostMessageToChannel({
    message: likeMessageTemplate.setDate({
      notionPageId,
    }),
    ...handleMsg,
  });
}
