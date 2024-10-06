import { AvailableIntentsEventsEnum } from "qq-guild-bot";
import { ws } from "./qq-api";
import { handleMessage } from "./qq-event-handle";
import { formatDateStr } from "./utils";

// 频道中的子频道发送任意非机器人消息触发
// @ts-ignore
ws.on(AvailableIntentsEventsEnum.GUILD_MESSAGES, (data) => {
  console.log(`${formatDateStr()} [GUILD_MESSAGES] 事件接收 :`, data);
  handleMessage(data);
});

// 群组和私聊的信息触发
// @ts-ignore
ws.on("GROUP_AND_C2C_EVENT", (data) => {
  console.log(`${formatDateStr()} [GROUP_AND_C2C_EVENT] 事件接收 :`, data);
  handleMessage(data);
});

// // @ts-ignore
// ws.on("READY", (data) => {
//   console.log(`${formatDateStr()} [READY] 事件接收 :`, data);
// });
// // @ts-ignore
// ws.on("ERROR", (data) => {
//   console.log(`${formatDateStr()} [ERROR] 事件接收 :`, data);
// });

// @机器人后触发
// // @ts-ignore
// ws.on("PUBLIC_GUILD_MESSAGES", (data) => {
//   console.log(`${formatDateStr()} [PUBLIC_GUILD_MESSAGES] 事件接收 :`, data);
//   handleMessage(data);
// });

// // @ts-ignore
// ws.on("GUILDS", (data) => {
//   console.log(`${formatDateStr()} [GUILDS] 事件接收 :`, data);
// });
// // @ts-ignore
// ws.on("GUILD_MEMBERS", (data) => {
//   console.log(`${formatDateStr()} [GUILD_MEMBERS] 事件接收 :`, data);
// });

// // @ts-ignore
// ws.on("GUILD_MESSAGE_REACTIONS", (data) => {
//   // prettier-ignore
//   console.log(`${formatDateStr()} [GUILD_MESSAGE_REACTIONS] 事件接收 :`, data);
// });
// // @ts-ignore
// ws.on("DIRECT_MESSAGE", (data) => {
//   console.log(`${formatDateStr()} [DIRECT_MESSAGE] 事件接收 :`, data);
// });
// // @ts-ignore
// ws.on("INTERACTION", (data) => {
//   console.log(`${formatDateStr()} [INTERACTION] 事件接收 :`, data);
// });
// // @ts-ignore
// ws.on("MESSAGE_AUDIT", (data) => {
//   console.log(`${formatDateStr()} [MESSAGE_AUDIT] 事件接收 :`, data);
// });
// // @ts-ignore
// ws.on("FORUMS_EVENT", (data) => {
//   console.log(`${formatDateStr()} [FORUMS_EVENT] 事件接收 :`, data);
// });
// // @ts-ignore
// ws.on("AUDIO_ACTION", (data) => {
//   console.log(`${formatDateStr()} [AUDIO_ACTION] 事件接收 :`, data);
// });
