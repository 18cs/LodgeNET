import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: any[], filterString: string, propName: string): any {
    if (!filterString) {
      return null;
    }
    else if (!values) {
      return values;
    }

   return values.filter(value => value[propName].indexOf(filterString) !== -1);
// console.log(filterString);
//     const resultsArray = [];
//     for (const item of value) {
//       if() {

//       }
//     }
//     return resultsArray;
  }

}
