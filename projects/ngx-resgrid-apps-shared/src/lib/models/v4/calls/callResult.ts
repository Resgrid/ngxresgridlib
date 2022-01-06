import { BaseV4Request } from "../baseV4Request";
import { CallResultData } from "./callResultData";

export class CallResult extends BaseV4Request  {
    public Data: CallResultData = new CallResultData();
}
