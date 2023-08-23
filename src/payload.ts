export type TextValue = { role: "user" | "assistant", content: string };
export type MessageValue = { text: Array<TextValue> }
export type PayloadValue = { message: MessageValue }

export class Payload {
    constructor(protected text: Array<TextValue>) {

    }

    public static fromMessage(message: MessageValue): PayloadValue {
        return new Payload(message.text).toValue();
    }


    public toValue(): PayloadValue {
        return {
            message: {
                text: this.text
            }
        }
    }
}