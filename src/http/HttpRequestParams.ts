import {Version} from "../common/Version";
import {Role} from "../ws/Role";

export const HttpRequestModel: Record<Version, Model> = {
    [Version.Ultra]: "4.0Ultra",
    [Version.Max32k]: "max-32k",
    [Version.Max]: "generalv3.5",
    [Version.Pro128k]: "pro-128k",
    [Version.Pro]: "generalv3",
    [Version.Lite]: "lite"
}

export type Model = "lite" | "generalv3" | "pro-128k" | "generalv3.5" | "max-32k" | "4.0Ultra"

export type HttpRequestParamsMessageTextItem = { role: Role, content: string };
export type HttpRequestParamsMessages = Array<HttpRequestParamsMessageTextItem>

export interface HttpRequestParams {
    /**
     * 指定访问的模型版本
     */
    model: Model;

    /**
     * 用户的唯一id，表示一个用户
     */
    user?: string;

    /**
     * 输入数组
     */
    messages: HttpRequestParamsMessages;

    /**
     * 核采样阈值
     * @default 1.0
     */
    temperature?: number;

    /**
     * 生成过程中核采样方法概率阈值
     * @default 1
     */
    top_p?: number;

    /**
     * 从k个中随机选择一个(非等概率)
     * @default 4
     */
    top_k?: number;

    /**
     * 重复词的惩罚值
     * @default 0
     */
    presence_penalty?: number;

    /**
     * 频率惩罚值
     * @default 0
     */
    frequency_penalty?: number;

    /**
     * 是否流式返回结果
     * @default false
     */
    stream?: boolean;

    /**
     * 模型回答的tokens的最大长度
     * @default Pro、Max、Max-32K、4.0 Ultra 取值为[1,8192]，默认为4096;
     * Lite、Pro-128K 取值为[1,4096]，默认为4096。
     */
    max_tokens?: number;

    /**
     * 指定模型的输出格式
     */
    response_format?: {
        type: 'text' | 'json_object';
    };

    /**
     * 工具参数
     */
    tools?: Array<{
        /**
         * 工具函数类型
         */
        type: 'function' | 'web_search';
        /**
         * 工具函数详情或搜索功能开关
         */
        function?: {
            name: string;
            description: string;
            parameters: Record<string, any>;
        };
        /**
         * 是否开启搜索功能
         */
        web_search?: {
            enable: boolean;
        };
    }>;

    /**
     * 设置模型自动选择调用的函数
     */
    tool_choice?: 'auto' | 'none' | 'required' | {
        type: 'function';
        function: {
            name: string;
        };
    };
}