import {AbstractSparkDesk} from "../common/AbstractSparkDesk";
import {Version} from "../common/Version";
import {HttpRequestParams} from "./HttpRequestParams";
import axios from "axios";
import {HttpResponse} from "./HttpResponse";
import {HttpUser} from "./HttpUser";

export interface HttpSparkDeskOption {
    APIPassword: string,
    version: Version;
    /**
     * @default HttpSparkDesk.DefaultUrl
     */
    url?: string,
}

export class HttpSparkDesk extends AbstractSparkDesk {

    public static DefaultUrl = "https://spark-api-open.xf-yun.com/v1/chat/completions";

    public constructor(protected option: HttpSparkDeskOption) {
        super();
    }

    get version(): Version {
        return this.option.version
    }

    public override createUser(uid: string, tokenLength?: number): HttpUser {
        return new HttpUser(this, uid, tokenLength);
    }

    async request(params: HttpRequestParams) {
        return axios.post<HttpResponse>(this.getUrl(),
            params,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.option.APIPassword}`
                },
            });
    }

    protected getUrl() {
        return this.option.url ?? HttpSparkDesk.DefaultUrl;
    }
}