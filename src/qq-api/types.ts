import type { IMessage } from "qq-guild-bot";

export type ResponseMessage = IMessage & {
  message_reference?: { message_id: string };
};
