import {SparkDeskOption} from "./SparkDesk";

export type ParameterValue = {
    chat: {
        domain: string,
        temperature?: number,
        max_tokens?: number,
        top_k?: number,
        chat_id?: number
    }
}

export class Parameter {
    constructor(protected domain: "general" | "generalv2" | "generalv3" | "generalv3.5" | string,
                protected temperature: number = 0.5,
                protected max_tokens: number = 2048,
                protected top_k: number = 4,
                protected chat_id?: number) {

    }

    public static createFromVersion(version: SparkDeskOption['version']) {
        function getDomain(version: SparkDeskOption['version']) {
            switch (version) {
                case 1:
                    return "general"
                case 2:
                    return "generalv2"
                case 3:
                    return "generalv3"
                case 3.5:
                    return "generalv3.5"
                default:
                    throw new Error("不存在的版本.")
            }
        }

        return new Parameter(getDomain(version))
    }

    public toValue(): ParameterValue {
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