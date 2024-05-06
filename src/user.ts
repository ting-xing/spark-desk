import {OnMessage, SparkDesk} from "./SparkDesk";
import {TextValue} from "./payload";
import {Parameter} from "./parameter";
import {Response} from './response'
import {Role} from "./role";


export class User {

    /**
     * 历史问答信息
     * @protected
     */
    protected history: Array<TextValue> = []
    /**
     * 设置对话背景或者模型角色
     * @protected
     */
    protected systemContent: string | null = null;

    /**
     *
     * @param spark
     * @param uid 用户ID
     * @param tokenLength history 的长度，只计算 content 字段的累计值. max 8192
     */
    constructor(protected spark: SparkDesk, protected uid: string, protected tokenLength: number = 5000) {

    }

    /**
     * 向星火大模型提出问题
     */
    public async speak(content: string, parameter?: Parameter): Promise<Response>
    public async speak(content: string, parameter: Parameter, onMessage?: OnMessage): Promise<Response>
    public async speak(content: string, parameter: Parameter = Parameter.createFromVersion(this.spark.version), onMessage?: OnMessage): Promise<Response> {

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

        return response;
    }

    protected getHistory(length: number = this.tokenLength): Array<TextValue> {
        const returnValue: Array<TextValue> = [];
        // 是否设置对话背景或者模型角色
        if (this.systemContent !== null && this.systemContent.length > 0) {
            returnValue.push({
                role: Role.System,
                content: this.systemContent,
            })
        }

        const currentLength = 0;
        for (let textValue of this.history) {
            if (currentLength + textValue.content.length <= length) {
                returnValue.push(textValue);
            } else {
                return returnValue;
            }
        }


        return returnValue;
    }

    /**
     * 设置对话背景或者模型角色，默认不开启，设置任意内容开启
     * @example 如果设置为 null ,则反比对话背景 setSystemContent(null)
     * @example setSystemContent("你现在扮演李白，你豪情万丈，狂放不羁；接下来请用李白的口吻和用户对话。")
     * @param systemContent
     */
    public setSystemContent(systemContent: User['systemContent']) {
        this.systemContent = systemContent;
    }

}