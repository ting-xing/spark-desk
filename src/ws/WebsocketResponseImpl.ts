import {WebsocketResponse} from "./WebsocketResponse";

export class WebsocketResponseImpl {
    constructor(protected websocketResponses: Array<WebsocketResponse>) {
    }

    /**
     * 获取AI返回的内容拼接
     */
    public getAllContent() {
        this.hasError();
        return this.websocketResponses.map(response => response.payload.choices.text.map(text => text.content).join("")).join("")
    }

    // 历史问题部分消耗的token数量
    public getPromptTokens() {
        this.hasError();
        return this.websocketResponses.at(-1)?.payload.usage?.text.prompt_tokens;
    }

    // 回答部分消耗的token数量
    public getCompletionTokens() {
        this.hasError();
        return this.websocketResponses.at(-1)?.payload.usage?.text.completion_tokens;
    }

    // 本次回答总共消耗的token数量
    public getTotalTokens() {
        this.hasError();
        return this.websocketResponses.at(-1)?.payload.usage?.text.total_tokens;
    }

    public hasError() {
        this.websocketResponses.forEach(response => {
            if (response.header.code !== 0) {
                throw new Error(JSON.stringify(response))
            }
        })
    }

    public getSid() {
        const [firstResponse = null] = this.websocketResponses
        if (firstResponse === null) {
            throw new Error("没有相应任何内容")
        } else {
            return firstResponse.header.sid
        }
    }
}