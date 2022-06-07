import { BaseV4Request } from "../baseV4Request";
import { ProtocolResultData } from "./protocolResultData";

export class ProtocolResult extends BaseV4Request  {
    public Data: ProtocolResultData[] = [];
}
