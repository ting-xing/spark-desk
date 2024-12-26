/**
 * 大模型的回复结果
 */
export interface Answer {
    /**
     * 用户输入信息，消耗的token数量
     */
    promptTokens: number,
    /**
     * 大模型输出信息，消耗的token数量
     */
    completionTokens: number,

    /**
     * 用户输入+大模型输出，总的token数量
     */
    totalTokens: number,
    /**
     * 大模型回复的内容
     */
    content: string,
    /**
     * 唯一ID
     */
    sid: string
}