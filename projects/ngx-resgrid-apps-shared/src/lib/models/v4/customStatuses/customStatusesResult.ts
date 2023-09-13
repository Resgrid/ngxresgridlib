import { BaseV4Request } from '../baseV4Request';
import { CustomStatusResultData } from './customStatusResultData';

export class CustomStatusesResult extends BaseV4Request {
  public Data: CustomStatusResultData[] = [];
}
