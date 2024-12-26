import {Answer} from "./Answer";

export abstract class AbstractUser<Message = object> {

    /**
     * 历史问答信息
     * @protected
     */
    protected history: Array<Message> = []

    constructor(protected tokenLength: number = 8192) {
    }

    public setTokenLength(tokenLength: number) {
        this.tokenLength = tokenLength;
    }

    public abstract setSystemContent(content: string): void;

    abstract speak(content: string, ...args: any[]): Promise<Answer>;

    protected abstract getMessageLength(message: Message): number;

    /**
     * 生成UID
     */
    public static generateUid() {
        return Math.random().toString(36).substring(2, 16);
    }

    protected getHistory(length: number = this.tokenLength): Array<Message> {
        const messages: Array<Message> = [];


        const currentLength = 0;
        for (let textValue of this.history) {
            if (currentLength + this.getMessageLength(textValue) <= length) {
                messages.push(textValue);
            } else {
                return messages;
            }
        }

        return messages;
    }
}