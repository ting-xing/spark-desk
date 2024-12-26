import {Version} from "../common/Version";
import {ParameterDomain} from "../ws/Parameter";

export const HttpRequestModel: Record<Version, ParameterDomain> =  {
    [Version.Ultra]: "4.0Ultra",
    [Version.Max32k]: "max-32k",
    [Version.Max]: "generalv3.5",
    [Version.Pro128k]: "pro-128k",
    [Version.Pro]: "generalv3",
    [Version.Lite]: "lite"
}