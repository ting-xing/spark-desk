import {AbstractUser} from "../common/AbstractUser";
import {Answer} from "../common/Answer";
import {HttpSparkDesk} from "./HttpSparkDesk";
import {HttpRequestParamsMessageTextItem} from "./HttpRequestParams";
import {Role} from "../ws/Role";
import {HttpRequestModel} from "./HttpRequestModel";

export class HttpUser extends AbstractUser<HttpRequestParamsMessageTextItem> {

    protected override getMessageLength(message: HttpRequestParamsMessageTextItem): number {
        return message.content.length;
    }

    public override setSystemContent(content: string) {
        this.history.push({role: Role.System, content: content})
    }


    /**
     *
     * @param spark
     * @param uid 用户ID
     * @param tokenLength 控制历史消息的长度
     */
    constructor(protected spark: HttpSparkDesk, protected uid: string = AbstractUser.generateUid(), tokenLength: number = 8192) {
        super(tokenLength);
    }

    override async speak(content: string): Promise<Answer> {
        const response = await this.spark.request({
            "model": HttpRequestModel[this.spark.version],
            "messages": [
                ...this.getHistory(),
                {
                    "role": Role.User,
                    "content": content
                }
            ],
        })

        const assistantContent = response.data.choices[0].message.content;


        this.history.push({role: Role.User, content: content});
        this.history.push({role: Role.Assistant, content: assistantContent});

        return {
            content: assistantContent,
            promptTokens: response.data.usage.prompt_tokens,
            completionTokens: response.data.usage.completion_tokens,
            totalTokens: response.data.usage.total_tokens,
            sid: response.data.sid
        }
    }

}