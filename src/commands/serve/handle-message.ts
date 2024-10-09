import type { ResponseMessage } from "@/qq-api";
import { isCustomError } from "@/types";
import { formatDateStr } from "@/utils";
import { handleAutoLikeMessage, handleLikeMessage } from "./event-handles";
import { Directives } from "./types";
import { analyserDirect, getMessageContext } from "./utils";
import { $ } from "bun";

export async function handleMessage(message: {
  eventType: string;
  eventId: string;
  msg: ResponseMessage;
}) {
  const context = getMessageContext(message);

  if (context) {
    const { messageContext, clientApi } = context;

    try {
      const { msg } = message;

      const messageContent = analyserDirect(msg.content);

      switch (messageContent.direct) {
        case Directives.Like: {
          const notionPageId = await handleLikeMessage({
            context: messageContext,
            clientApi,
            messageContent,
          });

          return await $`echo ${notionPageId}`;
        }
        case Directives.AutoLike: {
          const notionPageId = await handleAutoLikeMessage({
            context: messageContext,
            clientApi,
            messageContent,
          });

          return await $`echo ${notionPageId}`;
        }
      }
    } catch (error) {
      if (isCustomError(error)) {
        if (error.postUser) {
          clientApi.safetyPostMessage({
            message: error.msg,
            contextId: messageContext.contextId,
            referId: messageContext.messageId,
          });
        }

        console.error(
          `[${formatDateStr()}]: ${error.msg}\nreason:${
            typeof error.reason === "object"
              ? JSON.stringify(error.reason)
              : error.reason
          }`
        );

        return;
      }

      console.error(
        `[${formatDateStr()}]: ${
          typeof error === "object" ? JSON.stringify(error) : error
        }`
      );
    }
  }
}
