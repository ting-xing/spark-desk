import NodeWebSocket from "ws";

export enum Environment {
    Browser,
    Node
}

/**
 * 适配浏览器环境和node环境
 */
export class WebSocketAdapter {

    protected webSocket: NodeWebSocket | WebSocket;

    protected environment = WebSocketAdapter.getEnvironment();


    constructor(protected url: string | URL) {
        if (this.environment === Environment.Browser) {
            this.webSocket = new WebSocket(url)
        } else {
            this.webSocket = new NodeWebSocket(url)
        }
    }

    public static getEnvironment() {
        if (typeof window !== 'undefined') {
            return Environment.Browser
        } else {
            return Environment.Node
        }
    }


    public addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
        if (this.environment === Environment.Browser && this.webSocket instanceof WebSocket) {
            this.webSocket.addEventListener<K>(type, listener, options)
        } else if (this.webSocket instanceof NodeWebSocket) {
            // @ts-ignore
            this.webSocket.addEventListener(type, listener, options)
        }
    }

    public removeEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
        if (this.environment === Environment.Browser && this.webSocket instanceof WebSocket) {
            this.webSocket.removeEventListener<K>(type, listener, options)
        } else if (this.webSocket instanceof NodeWebSocket) {
            // @ts-ignore
            this.webSocket.removeEventListener(type, listener, options)
        }
    }

    public close() {
        this.webSocket.close();
    }

    public send(data: string) { // 目前只处理 string 类型的数据
        this.webSocket.send(data)
    }
}