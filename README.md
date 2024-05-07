## spark-desk

这是一个使用WebSocket调用 [讯飞星火认知大模型](https://xinghuo.xfyun.cn/sparkapi)
的js库。 [星火认知大模型Web API文档](https://www.xfyun.cn/doc/spark/Web.html)

1. 使用 typescript
2. 支持 cjs 和 esm
3. 在命令行中使用
4. 面向对象
5. 支持 V1.5、V2、V3、V3.5接口,支持 system(对话背景) 特性。
6. 支持在浏览器、nodejs里运行

> 对于 `node`，基于 `ws` 实现。   
> 对于 `浏览器`，基于 `原生WebSocket` 实现。

### 简单尝试

**你需要在`讯飞开放平台`中申请星火大模型的使用**

前往 [在线样例](https://ting-xing.github.io/spark-desk-ui/)

### 在命令行里使用

```shell
npm i spark-desk -g
```

在安装后，运行 `spark-desk` 命令，会让你输入 `APPID` 、 `APISecret` 、 `APIKey`;
之后，这些信息将保存到你的用户目录下的 `.spark-desk` 文件中，以 `json` 的方式。

> 你可以手动编辑 `.spark-desk` 文件，以达到改变配置文件的目的

> 程序默认使用的版本是 V3.5

在程序启动后，你可以通过命令行与AI交互。

```shell
C:\Users\user>spark-desk
spark-desk > 你好
你好！有什么我可以帮忙的吗？[10/9/19]
spark-desk >
```

其中 `[10/9/19]` 表示每次回答 token
的消耗，具体对应着 `[prompt_tokens/completion_tokens/total_tokens]`,[参考文档](https://www.xfyun.cn/doc/spark/Web.html#_1-%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E)

比较有意思的是，你可已通过 -u 参数指定用户名称，也就是指定 请求参数中的 uid 字段，同时，命令行前缀也将显示成 uid 。

```shell
spark-desk -u demo
demo > 
```

> 程序也会读取配置文件中的 uid 字段，但是命令行中指定的优先级更高。

### 关于历史消息

提问时，可以将之前的历史消息发送一起发送，以获得良好的上下文体验，但这样通常会消耗大量的 token 。

你可以通过 `-l` 参数指定文本内容的长度.
> 是字母 L 的小写, length 的首字母。

默认情况下，任何历史消息都不会发送,也就是 `-l = 0` 。

使用样例

```shell
C:\Users\user>spark-desk -l 20
spark-desk > 我叫 spark-desk
[13/21/34] 你好，spark-desk!很高兴为你提供帮助。请问有什么问题我可以帮您解答吗？
spark-desk > 我叫什么？
[25/16/41] 很抱歉，我不知道你叫什么。请问有什么我可以帮助你的吗？
spark-desk > 我叫什么？
[25/13/38] 您的名字是“spark-desk”，这是一个虚构的名字。
```

> 回答有概率问题，但是AI大概率会告诉你 你叫 spark-desk , 因为有上下文。
> 如果不指定 -l 参数，AI 基本上不会回答出你的名字。 因为上下文没有一起发送。

### 在您的项目里一起使用

##### cjs 方式

```js
// index.js
const {SparkDesk} = require("spark-desk")
// 根据实际情况填写
const sparkDesk = new SparkDesk({
    APPID: "a5fxxxxxx",
    APISecret: "MGIxNTcwNDI4MGY1YjUxM2Mxxxxxxx",
    APIKey: "aa5fbf57f7818bd1cec61dexxxxxxxx",
    version: 3.5
});

const user = sparkDesk.createUser("demo");

user.speak("你好!很高兴认识你。").then(res => console.log(res.getAllContent()))
```

输出

```shell
node .\index.js
你好！很高兴认识你。请问有什么问题我可以帮您解答吗？
```

##### esm 方式

只需要将第一行换成下面的代码即可。

```js
// index.mjs
import {SparkDesk} from "spark-desk"
```

#### 本项目开发环境

| 名称       | 版本              |
|----------|-----------------|
| nodejs   | v18.17.1        |
| npm      | 10.5.2          |
| OS       | Windows 11 专业版  |
| webstorm | WebStorm 2023.2 |





