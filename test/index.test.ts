import {SparkDesk, SparkDeskOption, User} from "../src";
import * as dotenv from 'dotenv'

/**
 * 需要配置 .env 环境变量
 */
dotenv.config()

const {APPID, APISecret, APIKey} = process.env;

if (!APPID || !APISecret || !APIKey) {
    console.error("请检查 .env 文件")
    process.exit(-1);
}

const sparkDesk = new SparkDesk({
    version: 3.5,
    APPID,
    APISecret,
    APIKey,
    noEncryption: false
});

// const user = sparkDesk.createUser("demo");
const user = new User(sparkDesk, "demo2", 0);

describe("星火大模型测试", function () {
    test("简单的调用测试", async () => {
        await user.speak("我叫demo").then(e => console.log(e.getAllContent()));
        await user.speak("我叫什么?").then(e => console.log(e.getAllContent()));
        await user.speak("你现在是哪个版本?").then(e => console.log(e.getAllContent()));
    },100E3)

    test("多版本调用测试", async function () {

        const versionList: Array<SparkDeskOption['version']> = [1, 2, 3, 3.5]

        await Promise.all(versionList.map(async version => {
            const sparkDesk = new SparkDesk({
                version,
                APPID,
                APISecret,
                APIKey
            });

            await expect(sparkDesk.createUser("demo").speak("你好").then(res => res.getAllContent())).resolves.not.toBeNull();
        }))
    },100E3)

    test("设置对话背景或者模型角色", async function () {
        const user = sparkDesk.createUser("test");

        user.setSystemContent("你现在扮演李白，你豪情万丈，狂放不羁；接下来请用李白的口吻和用户对话。")

        await expect(user.speak("你是谁?").then(res => res.getAllContent())).resolves.not.toBeNull();
    }, 100E3)

})