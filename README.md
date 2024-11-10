# notion-qq-robot

通过 QQ 机器人将内容收集到 notion 页面中

## 参数获取和应用配置

### 机器人

1. 到[QQ 机器人的官网](https://q.qq.com/#/)注册一个机器人，注册后就能获得 app-id 和 token
2. 到 开发 -> [沙箱配置](https://q.qq.com/qqbot/#/developer/sandbox) 中的 **在消息列表配置** 和 **在 QQ 频道配置** 添加自己的账号，没有频道就注册一个就行
3. 到 发布设置 -> [功能配置](https://q.qq.com/qqbot/#/developer/publish-config/function-config) 中新建以下指令，使用场景勾上 **QQ 频道**、**消息列表**
   - /like
4. 到 QQ 中把机器人拉进频道，给个管理员权限，自己也可以在添加好友中加上它

### notion

1. 到 notion 的[集成页面](https://www.notion.so/my-integrations)新建一个 **Internal** 集成，然后复制 secret，这个就是 `--notion-secret`
2. 复制[这个模版](https://succinct-suede-c59.notion.site/Stars-117b65a43fca80ada97ace33432be743?pvs=25)到自己的空间，**不要修改鼠标表格的字段名字，但是可以新增**
3. 到复制的模版中，点击右上角的设置，在最下面有个链接选项，把刚才创建的集成链接到该页面
4. 查看复制后模版的链接 `https://www.notion.so/<database-name>-<database-id>?pvs=4` 其中 database-id 就是 `--notion-bookmark` 参数需要的值

## Usage

### 启动机器人服务

```bash
notion-qq-robot-cli serve --robot-app-id <ROBOT_APP_ID> --robot-token <ROBOT_TOKEN> --notion-secret <NOTION_SECRET> --notion-bookmark <NOTION_BOOKMARK>
```

#### 回复机器人：自动收藏（支持频道、私聊）

在某个 app/网站 中看到了想要收藏的内容，点击它自带的转发按钮，将内容转发给机器人或者有机器人的频道的文字子频道中，机器人会自动处理链接，放到 notion 的收藏页面

> 如果是 BiliBili 这种转发后会变成 QQ 小程序的链接，一般都有一个安卓原生的转发功能，用那个功能转发给机器人的私聊页面

#### 机器人指令（/like）：手动收藏（支持频道）

在服务没有启动的情况下转发给机器人不会触发收藏，但是在服务启动后选中没有收藏到的内容，使用 QQ 的引用功能在回复引用时手动触发机器人的 `/like` 指令来做到手动让机器人触发收藏功能

> 该功能因为私聊的 api 限制，无法读取回复的应用，所以只有频道中支持

### 命令行

该工具不仅提供启动机器人服务的命令，同时提供了命令行的功能，以方便将机器人的能力集成进其他工具（如 mac 的快捷指令）

#### star

支持参数传入或者 stdin 的输入

```bash
notion-qq-robot-cli star [shared] --notion-secret <NOTION_SECRET> --notion-bookmark <NOTION_BOOKMARK>

echo "shared" | notion-qq-robot-cli star --notion-secret <NOTION_SECRET> --notion-bookmark <NOTION_BOOKMARK>
```
