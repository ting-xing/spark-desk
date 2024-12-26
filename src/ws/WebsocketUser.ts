import {OnMessage, WebsocketSparkDesk} from "./WebsocketSparkDesk";
import {WebsocketRequestParamsMessageTextItem} from "./WebsocketRequestParams";
import {Parameter} from "./Parameter";
import {Role} from "./Role";
import {AbstractUser} from "../common/AbstractUser";
import {Answer} from "../common/Answer";


export class WebsocketUser extends AbstractUser<WebsocketRequestParamsMessageTextItem> {
    public setSystemContent(content: string): void {
        this.history.push({role: Role.System, content: content})
    }

    protected override getMessageLength(message: WebsocketRequestParamsMessageTextItem): number {
        return message.content.length;
    }

    /**
     * 历史问答信息
     * @protected
     */
    protected history: Array<WebsocketRequestParamsMessageTextItem> = []


    /**
     *
     * @param spark
     * @param uid 用户ID
     * @param tokenLength 控制历史消息的长度
     */
    constructor(protected spark: WebsocketSparkDesk, protected uid: string = AbstractUser.generateUid(), tokenLength: number = 8192) {
        super(tokenLength);
    }

    /**
     * 向星火大模型提出问题
     */
    public async speak(content: string, parameter?: Parameter): Promise<Answer>
    public async speak(content: string, parameter: Parameter, onMessage?: OnMessage): Promise<Answer>
    public async speak(content: string, parameter: Parameter = Parameter.createFromVersion(this.spark.version), onMessage?: OnMessage): Promise<Answer> {

        if (content.length <= 0) {
            throw new Error("内容不可以为空.")
        }

        const response = await this.spark.request({
            header: {
                app_id: this.spark.APPID,
                uid: this.uid
            },
            parameter: parameter.toValue(),
            payload: {
                message: {
                    text: [
                        ...this.getHistory(),
                        {role: Role.User, content: content}
                    ]
                }
            }
        }, 60E3, onMessage)


        this.history.push({role: Role.User, content: content});
        this.history.push({role: Role.Assistant, content: response.getAllContent()});

        return {
            content: response.getAllContent(),
            promptTokens: response.getPromptTokens() ?? -1,
            completionTokens: response.getCompletionTokens() ?? -1,
            totalTokens: response.getTotalTokens() ?? -1,
            sid: response.getSid(),
        }
    }

}