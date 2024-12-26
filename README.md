## spark-desk

这是一个使用HTTP/WebSocket调用 [讯飞星火认知大模型](https://xinghuo.xfyun.cn/sparkapi)
的js库。

1. 使用 typescript
2. 支持 cjs 和 esm
3. 在命令行中使用
4. 面向对象
5. 支持所有版本接口
6. 支持在浏览器、nodejs里运行

### 简单尝试

前往 [在线样例](https://ting-xing.github.io/spark-desk-ui/)

### 在您的项目里使用

#### 使用 Websocket

```ts
import {Version, WebsocketSparkDesk} from 'spark-desk'

const sparkDesk = new WebsocketSparkDesk({
    APPID: "a5fxxxxxx",
    APISecret: "MGIxNTcwNDI4MGY1YjUxM2Mxxxxxxx",
    APIKey: "aa5fbf57f7818bd1cec61dexxxxxxxx",
    version: Version.Ultra
});

const user = sparkDesk.createUser("张三");

user.speak("你好!很高兴认识你。").then(answer => console.log(answer.content))
```

#### 使用 HTTP

```ts
import {Version, HttpSparkDesk} from 'spark-desk'

const sparkDesk = new HttpSparkDesk({
    APIPassword: "qNuVTubjjhxxxxxxx:lPktJLLhrxxxxxxxx",
    version: Version.Ultra
});

const user = sparkDesk.createUser("张三");

user.speak("你好!很高兴认识你。").then(answer => console.log(answer.content))
```

### 更多参数

```ts
import {WebsocketSparkDesk} from "./WebsocketSparkDesk";
import {HttpSparkDesk} from "./HttpSparkDesk";

const websocketSparkDesk = new WebsocketSparkDesk(/*配置*/);

websocketSparkDesk.request({
    // websocket 参数 
    // https://www.xfyun.cn/doc/spark/Web.html#_1-%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E
}) // 返回 WebsocketResponseImpl 对象

const httpSparkDesk = new HttpSparkDesk(/*配置*/);

httpSparkDesk.request({
    // http 参数
    // https://www.xfyun.cn/doc/spark/HTTP%E8%B0%83%E7%94%A8%E6%96%87%E6%A1%A3.html#_3-%E8%AF%B7%E6%B1%82%E8%AF%B4%E6%98%8E
}) // 返回 AxiosResponse

```

### 底层实现

| 环境      | HTTP模式 | websocket模式 |
 |---------|--------|-------------|
| node    | axios  | ws库         |
| browser | axios  | 原生Websocket |

#### 本项目开发环境

| 名称       | 版本              |
|----------|-----------------|
| nodejs   | v18.19.1        |
| npm      | 10.2.4          |
| OS       | Windows 11 专业版  |
| webstorm | WebStorm 2023.2 |





