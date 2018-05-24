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

   return values.filter(value => value[propName].toUpperCase().indexOf(filterString.toUpperCase()) !== -1);
  }

}
