import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number) : string {
    limit = limit== 1 ? +value.length + 1 : limit;
    let trail = '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  
  }
}