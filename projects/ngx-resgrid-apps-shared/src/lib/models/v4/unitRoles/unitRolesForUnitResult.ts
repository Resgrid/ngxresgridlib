import { BaseV4Request } from '../baseV4Request';
import { UnitRoleResultData } from './unitRoleResultData';

export class UnitRolesForUnitResult extends BaseV4Request {
  public Data: UnitRoleResultData[] = [];
}
