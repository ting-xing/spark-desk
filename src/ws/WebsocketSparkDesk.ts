import CryptoJS from "crypto-js";
import {WebsocketRequestParams} from "./WebsocketRequestParams";
import {WebsocketResponse} from "./WebsocketResponse";
import {WebsocketUser} from "./WebsocketUser";
import {WebSocketAdapter} from "./WebSocketAdapter";
import {WebsocketResponseImpl} from "./WebsocketResponseImpl";
import {WebsocketUrl} from "./WebsocketUrl";
import {Version} from "../common/Version";
import {AbstractSparkDesk} from "../common/AbstractSparkDesk";


export interface SparkDeskOption {
    APPID: string;
    APISecret: string;
    APIKey: string;
    version: Version;
    noEncryption?: boolean
}

export type OnMessage = <K extends keyof WebSocketEventMap>(event: WebSocketEventMap[K]) => void;

/**
 * 星火大模型
 */
export class WebsocketSparkDesk extends AbstractSparkDesk {

    /**
     * 版本
     */
    get version(): SparkDeskOption['version'] {
        return this.option.version
    };


    constructor(protected option: SparkDeskOption) {
        super();
    }

    public get APPID() {
        return this.option.APPID
    }

    protected getWebsocketUrl() {
        const apiKey = this.option.APIKey
        const apiSecret = this.option.APISecret
        const url = this.getUrl();
        if (this.option.noEncryption) {
            url.protocol = "ws";
        }
        const host = url.host
        const date = new Date().toUTCString()
        const algorithm = 'hmac-sha256'
        const headers = 'host date request-line'
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${url.pathname} HTTP/1.1`
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
        const signature = CryptoJS.enc.Base64.stringify(signatureSha)
        const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        const authorization = btoa(authorizationOrigin)
        return `${url}?authorization=${authorization}&date=${date}&host=${host}`
    }

    protected getUrl(): URL {
        if (this.option.version in WebsocketUrl) {
            return new URL(WebsocketUrl[this.option.version])
        }
        throw new Error("不存在的版本.")
    }

    public async request(request: WebsocketRequestParams): Promise<WebsocketResponseImpl>
    public async request(request: WebsocketRequestParams, timeout?: number): Promise<WebsocketResponseImpl>
    /**
     *
     * @param request
     * @param timeout
     * @param onMessage 此函数触发与  onMessage 时。
     */
    public async request(request: WebsocketRequestParams, timeout?: number, onMessage?: OnMessage): Promise<WebsocketResponseImpl>
    public async request(request: WebsocketRequestParams, timeout: number = 60E3, onMessage?: OnMessage): Promise<unknown> {

        return new Promise((resolve, reject) => {

            const t = setTimeout(() => {
                reject(new Error("请求超时")); // 1. 先拒绝
                websocket && websocket.close(); // 2. 尝试关闭 websocket
            }, timeout);

            const websocket = new WebSocketAdapter(this.getWebsocketUrl());

            const responseList: Array<WebsocketResponse> = [];

            websocket.addEventListener("open", () => {
                websocket.send(JSON.stringify(request));
            })

            websocket.addEventListener("message", (event) => {
                onMessage && onMessage(event);
                const responseValue = JSON.parse(event.data.toString()) as WebsocketResponse
                responseList.push(responseValue)
            })

            websocket.addEventListener("close", () => {
                clearTimeout(t); // 清除超时
                resolve(new WebsocketResponseImpl(responseList));
            })

            websocket.addEventListener("error", reject)


        })

    }

    public override createUser(uid: string, tokenLength?: number) {
        return new WebsocketUser(this, uid, tokenLength)
    }

}