import {Role} from "./Role";

export type WebsocketResponse = {
    header: {
        code: 0 | number, // 错误码，0表示正常，非0表示出错；详细释义可在接口说明文档最后的错误码说明了解
        message: string, // 会话是否成功的描述信息
        sid: string, // 会话的唯一id，用于讯飞技术人员查询服务端会话日志使用,出现调用错误时建议留存该字段
        status: number, // 会话状态，取值为[0,1,2]；0代表首次结果；1代表中间结果；2代表最后一个结果
    },
    payload: {
        choices: {
            status: string, // 文本响应状态，取值为[0,1,2]; 0代表首个文本结果；1代表中间文本结果；2代表最后一个文本结果
            seq: number, // 返回的数据序号，取值为[0,9999999]
            text: [{
                content: string, // AI的回答内容
                role: typeof Role.Assistant, // 角色标识，固定为assistant，标识角色为AI
                index: number, // 	结果序号，取值为[0,10]; 当前为保留字段，开发者可忽略
            }]
        },
        usage?: {
            text: {
                question_tokens: number, //	保留字段，可忽略
                prompt_tokens: number, // 包含历史问题的总tokens大小
                completion_tokens: number, // 回答的tokens大小
                total_tokens: number, // prompt_tokens和completion_tokens的和，也是本次交互计费的tokens大小
            }
        }
    }
}


