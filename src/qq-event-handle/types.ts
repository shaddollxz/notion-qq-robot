// 给机器人的指令 默认为 AutoLike
export enum Directives {
  Like = "like", // 通过引用回复并使用指令加入收藏
  AutoLike = "auto_like", // 自动将发送的内容加入收藏
}

export const DEFAULT_DIRECTIVE = Directives.AutoLike;
