import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  name: 'rgTimeAgoUtc',
})
export class RGTimeAgoUTCPipe implements PipeTransform {
  constructor(private utilsProvider: UtilsService) {}

  transform(value: string): string {
    return this.utilsProvider.getTimeAgoUtc(value);
  }
}
