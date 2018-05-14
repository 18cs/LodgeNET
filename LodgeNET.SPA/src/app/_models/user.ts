import { AccountType } from './accountType';
import { Rank } from './rank';
import { Service } from './service';

export interface User {
    userName: string;
    dodId: string;
    rankId: number;
    serviceId: number;
    accountTypeId: number;
    accountType: AccountType;
    firstName: string;
    middleInitial: string;
    lastName: string;
    approved: boolean;
    email: string;
    commPhone: string;
    dsnPhone: string;
    unitId: number;
}
