import type { ResponseMessage } from "../qq-api/types";
import { handleAutoLikeMessage, handleLikeMessage } from "./event-handles";
import { Directives } from "./types";
import { analyserDirect, getMessageContext } from "./utils";

export async function handleMessage(context: {
  eventType: string;
  eventId: string;
  msg: ResponseMessage;
}) {
  try {
    const { msg } = context;

    const { messageContext, clientApi } = getMessageContext(context);

    const messageContent = analyserDirect(msg.content);

    switch (messageContent.direct) {
      case Directives.Like: {
        return await handleLikeMessage({
          context: messageContext,
          clientApi,
          messageContent,
        });
      }
      case Directives.AutoLike: {
        return await handleAutoLikeMessage({
          context: messageContext,
          clientApi,
          messageContent,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}
