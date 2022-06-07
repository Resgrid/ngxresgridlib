import { BaseV4Request } from "../baseV4Request";
import { ShiftResultData } from "./shiftResultData";

export class ShiftsResult extends BaseV4Request  {
    public Data: ShiftResultData[] = [];
}
