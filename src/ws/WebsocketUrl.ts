import {Version} from "../common/Version";

export const WebsocketUrl: Record<Version, string> = {
    [Version.Ultra]: "wss://spark-api.xf-yun.com/v4.0/chat",
    [Version.Max32k]: "wss://spark-api.xf-yun.com/chat/max-32k",
    [Version.Max]: "wss://spark-api.xf-yun.com/v3.5/chat",
    [Version.Pro128k]: " wss://spark-api.xf-yun.com/chat/pro-128k",
    [Version.Pro]: "wss://spark-api.xf-yun.com/v3.1/chat",
    [Version.Lite]: "wss://spark-api.xf-yun.com/v1.1/chat"
}