import {Role} from "./Role";

export type WebsocketRequestParamsMessageTextItem = { role: Role, content: string };
export type WebsocketRequestParamsMessage = { text: Array<WebsocketRequestParamsMessageTextItem> }
/**
 * Websocket 方式请求参数
 */
export type WebsocketRequestParams = {
    header: {
        "app_id": string,
        "uid": string
    },
    parameter: {
        chat: {
            domain: string,
            temperature?: number,
            max_tokens?: number,
            top_k?: number,
            chat_id?: number
        }
    },
    payload: { message: WebsocketRequestParamsMessage }
}