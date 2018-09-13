export interface BuildingType {
    id: number;
    type: string;
    currentGuests: number;
    capacity: number;
    surgeCapacity: number;
    inSurge: boolean;
}
