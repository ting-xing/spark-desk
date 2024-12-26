import {Version} from "./Version";
import {AbstractUser} from "./AbstractUser";


export abstract class AbstractSparkDesk {

    // public constructor(protected option: SparkDeskOption) {
    // }

    // 返回版本
    abstract get version(): Version;

    // 发起请求
    abstract request(...args: any[]): any;

    // 创建用户
    abstract createUser(uid: string, tokenLength?: number): AbstractUser
}