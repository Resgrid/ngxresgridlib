import { BaseV4Request } from "../baseV4Request";
import { GetConfigResultData } from "./getConfigResultData";

export class GetConfigResult extends BaseV4Request  {
    public cacheKey: string = 'GetConfigResult';
    public cacheTime: number = 40320;
    public cacheSavedOn: Date | undefined = undefined;
    public cacheHitFailed: boolean = false;
    public cacheType: number = 1;

    public Data: GetConfigResultData = new GetConfigResultData();
}
