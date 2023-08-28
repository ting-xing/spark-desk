import CryptoJS from "crypto-js";
import {RequestValue} from "./request";
import {Response, ResponseValue} from "./response";
import WebSocket from 'ws'
import {User} from "./user";

export interface SparkDeskOption {
    APPID: string;
    APISecret: string;
    APIKey: string;
    version: 1 | 2;
    noEncryption?: boolean
}

/**
 * 星火大模型
 */
export class SparkDesk {

    /**
     * 版本
     */
    public version: 1 | 2 = 1;


    constructor(protected option: SparkDeskOption) {

    }

    public get APPID() {
        return this.option.APPID
    }

    protected getWebsocketUrl() {
        const apiKey = this.option.APIKey
        const apiSecret = this.option.APISecret
        const url = this.getDomain();
        if (this.option.noEncryption) {
            url.protocol = "ws";
        }
        const host = url.host
        const date = new Date().toUTCString()
        const algorithm = 'hmac-sha256'
        const headers = 'host date request-line'
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
        const signature = CryptoJS.enc.Base64.stringify(signatureSha)
        const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        const authorization = btoa(authorizationOrigin)
        return `${url}?authorization=${authorization}&date=${date}&host=${host}`
    }

    protected getDomain() {
        switch (this.option.version) {
            case 1:
                return new URL("wss://spark-api.xf-yun.com/v1.1/chat");
            case 2:
                return new URL("wss://spark-api.xf-yun.com/v2.1/chat");
            default:
                throw new Error("不存在的版本.")
        }
    }

    public async request(request: RequestValue, timeout: number = 60E3): Promise<Response> {

        return new Promise((resolve, reject) => {

            const t = setTimeout(() => {
                reject(); // 1. 先拒绝
                websocket && websocket.close(); // 2. 尝试关闭 websocket
            }, timeout);

            const websocket = new WebSocket(this.getWebsocketUrl());

            const responseList: Array<ResponseValue> = [];

            websocket.addListener("open", () => {
                websocket.send(JSON.stringify(request));
            })

            websocket.addListener("message", (data) => {
                const responseValue = JSON.parse(data.toString()) as ResponseValue
                responseList.push(responseValue)
            })

            websocket.addListener("close", () => {
                clearTimeout(t); // 清除超时
                resolve(new Response(responseList));
            })

            websocket.addListener("error", reject)


        })


    }

    public createUser(uid: string) {
        return new User(this, uid)
    }

}