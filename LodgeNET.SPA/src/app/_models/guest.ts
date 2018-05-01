import { Rank } from './rank';
import { Unit } from './unit';
import { Service } from './service';

export interface Guest {
    id: number;
    dodId: number;
    firstName: string;
    middleInitial: string;
    lastName: string;
    gender: string;
    email: string;
    commPhone: string;
    dsnPhone: string;
    chalk: number;
    serviceId: number;
    service: Service;
    rankId: number;
    rank: Rank;
    unitId: number;
    unit: Unit;
}
