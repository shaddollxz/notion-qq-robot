import { safetyPostMessageToChannel, type ResponseMessage } from "../../qq-api";
import { createBookMark } from "../../notion-api";
import {
  analyserShareContent,
  likeMessageTemplate,
  notSupportMessageGuardian,
  type MessageContentInfo,
} from "../utils";

export async function handleAutoLikeMessage(
  handleMsg: ResponseMessage,
  messageContent: MessageContentInfo
) {
  notSupportMessageGuardian(handleMsg, messageContent.content);

  const sharedData = analyserShareContent(messageContent.content);

  const bookMark = sharedData ?? {
    title: messageContent.content,
  };

  const { id: notionPageId } = await createBookMark(bookMark);

  return safetyPostMessageToChannel({
    message: likeMessageTemplate.setDate({
      notionPageId,
    }),
    ...handleMsg,
  });
}
