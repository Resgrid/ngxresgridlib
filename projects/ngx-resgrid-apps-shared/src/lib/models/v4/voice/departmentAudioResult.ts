import { BaseV4Request } from "../baseV4Request";
import { DepartmentAudioResultStreamData } from "./departmentAudioResultStreamData";

export class DepartmentAudioResult extends BaseV4Request  {
    public Data: DepartmentAudioResultStreamData[] = [];
}
