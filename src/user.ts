import {SparkDesk} from "./SparkDesk";
import {TextValue} from "./payload";
import {Parameter} from "./parameter";
import {Response} from './response'
import {ASSISTANT, USER} from "./role";

export class User {

    /**
     * 历史问答信息
     * @protected
     */
    protected history: Array<TextValue> = []

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
    public async speak(content: string, parameter: Parameter = Parameter.createFromVersion(this.spark.version)): Promise<Response> {

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
                        {role: USER, content: content}
                    ]
                }
            }
        })


        this.history.push({role: USER, content: content});
        this.history.push({role: ASSISTANT, content: response.getAllContent()});

        return response;
    }

    protected getHistory(length: number = this.tokenLength): Array<TextValue> {
        const returnValue: Array<TextValue> = [];
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

}