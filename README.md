# notion-qq-robot

将 QQ 机器人收集到的数据发送到 notion

## 参数获取和应用配置

### 机器人

1. 到 [QQ 机器人的官网](https://q.qq.com/#/)注册一个机器人，注册后就能获得 app-id 和 token
2. 到 开发 -> [沙箱配置](https://q.qq.com/qqbot/#/developer/sandbox) 中的 **在消息列表配置** 和 **在 QQ 频道配置** 添加自己的账号，没有频道就注册一个就行
3. 到 发布设置 -> [功能配置](https://q.qq.com/qqbot/#/developer/publish-config/function-config) 中新建以下指令，使用场景勾上 **QQ 频道**、**消息列表**
   - /like
4. 到 QQ 中把机器人拉进频道，给个管理员权限，自己也可以在添加好友中加上它

### notion

1. 到 notion 的[集成页面](https://www.notion.so/my-integrations)新建一个 **Internal** 集成，然后复制 secret，这个就是 `--notion-secret`
2. 复制[这个模版](https://succinct-suede-c59.notion.site/Stars-117b65a43fca80ada97ace33432be743?pvs=25)到自己的空间，**不要修改鼠标表格的字段名字，但是可以新增**
3. 查看复制后模版的链接 `https://www.notion.so/<database-name>-<database-id>?pvs=4` 其中 database-id 就是 `--notion-bookmark` 参数需要的值

## Usage

启动服务：

```bash
notion-qq-robot --robot-app-id <ROBOT_APP_ID> --robot-token <ROBOT_TOKEN> --notion-secret <NOTION_SECRET> --notion-bookmark <NOTION_BOOKMARK>
```

启动后就可以通过 qq 机器人把发送给它的链接收集起来了
