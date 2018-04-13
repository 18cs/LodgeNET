import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
    transform(array: any[], fields: string[2]): any[] {
      // for (let field of fields) {
        array.sort((a: any, b: any) => {
          if (a[fields[0]] < b[fields[0]]) {
            return -1;
          } else if (a[fields[0]] > b[fields[0]]) {
            return 1;
          } else {
            if (a[fields[1]] < b[fields[1]]) {
              return -1;
            } else if (a[fields[1]] > b[fields[1]]) {
              return 1;
            } else {
            return 0;
            }
          }
        });
      //}
        return array;
  }
}
