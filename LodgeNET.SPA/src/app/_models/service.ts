import { Rank } from './rank';

export interface Service {
    id: number;
    serviceName: string;
    ranks: Rank[];
}
