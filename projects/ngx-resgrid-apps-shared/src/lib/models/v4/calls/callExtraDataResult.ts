import { BaseV4Request } from "../baseV4Request";
import { CallExtraDataResultData } from "./callExtraDataResultData";

export class CallExtraDataResult extends BaseV4Request  {
    public Data: CallExtraDataResultData = new CallExtraDataResultData();
}
