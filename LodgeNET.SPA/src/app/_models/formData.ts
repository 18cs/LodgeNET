import { AccountType } from './accountType';
import { Unit } from './unit';
import { Service } from './service';

export interface FormData {
    accountTypeList: AccountType[];
    serviceList: Service[];
    unitList: Unit[];
}
