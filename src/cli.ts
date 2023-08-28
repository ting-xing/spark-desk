import {Command} from "commander";
import {version} from '../package.json'
import {SparkDesk, SparkDeskOption} from "./SparkDesk.js";
import * as fs from "node:fs/promises";
import * as path from 'node:path'
import * as readline from 'node:readline';
import {User} from "./user";
import {Parameter} from "./parameter";
import {Response} from "./response";

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

interface CliSparkDeskOption extends SparkDeskOption {
    uid: string
}

async function getConfig(): Promise<CliSparkDeskOption> {
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;

    if (!USER_HOME) {
        throw new Error("无法读取用户目录，无法读取用户配置文件.");
    }

    const configFilePath = path.join(USER_HOME, ".spark-desk");

    try {
        await fs.access(configFilePath);

        try {
            JSON.parse(await fs.readFile(configFilePath).then(res => res.toString()));
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error("配置文件格式错误,请检查配置文件: " + configFilePath.toString())
                process.exit(-1);
            }
        }

    } catch (e) {

        const APPID = await new Promise(resolve => rl.question("请输入 APPID:", resolve));
        const APISecret = await new Promise(resolve => rl.question("请输入 APISecret:", resolve));
        const APIKey = await new Promise(resolve => rl.question("请输入 APIKey:", resolve));

        // 创建默认的配置文件
        await fs.writeFile(configFilePath, JSON.stringify(<CliSparkDeskOption>{
            APPID: APPID,
            APISecret: APISecret,
            APIKey: APIKey,
            version: 2,
            noEncryption: false,
            uid: "spark-desk"
        }, undefined, "\t"));

    }

    return fs.readFile(configFilePath).then(res => <CliSparkDeskOption>JSON.parse(res.toString()));

}

const program = new Command();

program.name("星火大模型").description("通过命令行简单的使用星火大模型。").version(version);


program.argument("[question]", "对星火大模型提出的问题。")
    .option("-v,--version <version>", "指定版本，1 或者 2，默认为 1。", "1")
    .option("-u,--uid <uid>", "指定UID，默认为 spark-desk。", "spark-desk")
    .option("-l,--tokenLength <length>", "指定历史问答信息的token长度，1tokens 约等于1.5个中文汉字 或者 0.8个英文单词。默认为 0，没有上下文。", "0")
    .action(async (question: string | undefined, option: { uid: string, version: string, tokenLength: string }) => {
        const sparkDeskOption = await getConfig().catch(e => {
            throw new Error("读取配置失败:" + e.toString())
        })

        const sparkDesk = new SparkDesk(sparkDeskOption);

        const uid = option?.uid || sparkDeskOption.uid;

        const user = new User(sparkDesk, uid, parseInt(option.tokenLength));

        rl.setPrompt(uid + " > ")

        async function handlerContent(content: string) {
            try {
                const response = await user.speak(content, Parameter.createFromVersion(sparkDesk.version), (data) => {
                    process.stdout.write(new Response([JSON.parse(data.toString())]).getAllContent());
                });

                process.stdout.write(`[${response.getPromptTokens()}/${response.getCompletionTokens()}/${response.getTotalTokens()}]\n`);
            } catch (e) {
                process.stdout.write(e?.toString() + "\n");
            } finally {
                rl.prompt(); // 下一次的输入提示
            }
        }

        if (typeof question === "string" && question.length >= 0) {
            await handlerContent(question); // 首次的问题处理
        } else {
            rl.prompt(); // 输入提示
        }
        // 后续的问题处理
        rl.addListener("line", handlerContent);
        // 关闭事件
        rl.addListener("close", () => process.stdout.write("感谢您的使用."))
    })


program.parse();

