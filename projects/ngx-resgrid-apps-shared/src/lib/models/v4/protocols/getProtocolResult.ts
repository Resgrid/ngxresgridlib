import { BaseV4Request } from "../baseV4Request";
import { ProtocolResultData } from "./protocolResultData";

export class GetProtocolResult extends BaseV4Request  {
    public Data: ProtocolResultData = new ProtocolResultData();
}
