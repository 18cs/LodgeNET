import { Service } from './service';

export interface Rank {
    id: number;
    grade: number;
    rankName: string;
    serviceId: number;
    tier: string;
}
