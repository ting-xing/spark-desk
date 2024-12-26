import {Version, WebsocketSparkDesk, WebsocketUser} from "../src";
import * as dotenv from 'dotenv'

/**
 * 需要配置 .env 环境变量
 */
dotenv.config()

const {APPID, APISecret, APIKey, APIPassword} = process.env;

if (!APPID || !APISecret || !APIKey || !APIPassword) {
    console.error("请检查 .env 文件")
    process.exit(-1);
}

const sparkDesk = new WebsocketSparkDesk({
    version: Version.Ultra,
    APPID,
    APISecret,
    APIKey,
    noEncryption: false
});

const user = new WebsocketUser(sparkDesk, "张三", 0);

describe("星火大模型测试", function () {
    test("简单的调用测试", async () => {
        await user.speak("我叫张三").then(e => console.log(e.content));
        await user.speak("我叫什么?").then(e => console.log(e.content));
        await user.speak("你现在是哪个版本?").then(e => console.log(e.content));
    }, 100E3)


    test("设置对话背景或者模型角色", async function () {

        const user = sparkDesk.createUser("test");

        user.setSystemContent("你现在扮演李白，你豪情万丈，狂放不羁；接下来请用李白的口吻和用户对话。")

        const content = await user.speak("你是谁?").then(res => res.content);

        console.log(content)

        expect(content).not.toBeNull();
    }, 100E3)

})