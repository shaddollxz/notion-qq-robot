import { AvailableIntentsEventsEnum } from "qq-guild-bot";
import { getQQWebStock } from "@/qq-api";
import { formatDateStr } from "@/utils";
import { handleMessage } from "./handle-message";

export function serve() {
  const ws = getQQWebStock();

  // 频道中的子频道发送任意非机器人消息触发
  // @ts-ignore
  ws.on(AvailableIntentsEventsEnum.GUILD_MESSAGES, (data) => {
    console.log(
      `${formatDateStr()} [GUILD_MESSAGES] 事件接收 :`,
      JSON.stringify(data)
    );
    handleMessage(data);
  });

  // 群组和私聊的信息触发
  // @ts-ignore
  ws.on("GROUP_AND_C2C_EVENT", (data) => {
    console.log(
      `${formatDateStr()} [GROUP_AND_C2C_EVENT] 事件接收 :`,
      JSON.stringify(data)
    );
    handleMessage(data);
  });
}
