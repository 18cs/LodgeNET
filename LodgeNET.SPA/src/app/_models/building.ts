import { BuildingCategory } from "./buildingCategory";

export interface Building {
    id?: number;
    number?: number;
    name?: string;
    buildingCategoryId?: number;
    buildingCategory?: BuildingCategory;
    currentGuests?: number;
    capacity?: number;
    surgeCapacity?: number;
}

