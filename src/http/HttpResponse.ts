import {Role} from "../ws/Role";

export interface HttpResponse {
    "code": 0 | number,
    "message": "Success" | string,
    "sid": string,
    "choices": [
        {
            "message": {
                "role": Role.Assistant,
                "content": string
            },
            "index": number
        }
    ],
    "usage": {
        "prompt_tokens": number,
        "completion_tokens": number,
        "total_tokens": number
    }
}