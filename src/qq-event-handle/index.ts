import type { ResponseMessage } from "../qq-api/types";
import { handleAutoLikeMessage, handleLikeMessage } from "./event-handles";
import { Directives } from "./types";
import { analyserDirect } from "./utils";

export async function handleMessage({
  msg,
}: {
  eventType: string;
  eventId: string;
  msg: ResponseMessage;
}) {
  const messageContent = analyserDirect(msg.content);

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
