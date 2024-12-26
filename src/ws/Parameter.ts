import {SparkDeskOption} from "./WebsocketSparkDesk";
import {WebsocketRequestParams} from "./WebsocketRequestParams";
import {WebsocketDomain} from "./WebsocketDomain";

export type ParameterDomain = "lite" | "generalv3" | "pro-128k" | "generalv3.5" | "max-32k" | "4.0Ultra";


export class Parameter {
    constructor(protected domain: ParameterDomain | string,
                protected temperature: number = 0.5,
                protected max_tokens: number = 2048,
                protected top_k: number = 4,
                protected chat_id?: number) {

    }

    public static createFromVersion(version: SparkDeskOption['version']) {
        if (version in WebsocketDomain) {
            return new Parameter(WebsocketDomain[version])
        }
        throw new Error("不存在的版本.")

    }

    public toValue(): WebsocketRequestParams['parameter'] {
        return {
            chat: {
                domain: this.domain,
                temperature: this.temperature,
                max_tokens: this.max_tokens,
                top_k: this.top_k,
                chat_id: this.chat_id
            }
        }
    }

}