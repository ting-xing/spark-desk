import {HeaderValue} from "./header";
import {ParameterValue} from "./parameter";
import {PayloadValue} from "./payload";

export type RequestValue = {
    header: HeaderValue,
    parameter: ParameterValue,
    payload: PayloadValue
}