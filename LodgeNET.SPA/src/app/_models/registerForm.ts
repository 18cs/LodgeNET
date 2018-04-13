import { AccountType } from './accountType';
import { Unit } from './unit';
import { Service } from './service';

export interface RegisterForm {
    accountTypeList: AccountType[];
    serviceList: Service[];
    unitList: Unit[];
}
