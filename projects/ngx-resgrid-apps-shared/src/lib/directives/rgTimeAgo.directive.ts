import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  name: 'rgTimeAgo',
})
export class RGTimeAgoPipe implements PipeTransform {
  constructor(private utilsProvider: UtilsService) {}

  transform(value: string): string {
    return this.utilsProvider.getTimeAgo(value);
  }
}
