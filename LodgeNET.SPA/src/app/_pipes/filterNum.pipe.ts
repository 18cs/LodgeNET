import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNum'
})
export class FilterNumPipe implements PipeTransform {

  transform(values: any[], filterNum: number, propName: string): any {
    if (!filterNum) {
      return null;
    }
    else if (!values) {
      return values;
    }

   return values.filter(value => value[propName] === filterNum);
// console.log(filterString);
  }

}
