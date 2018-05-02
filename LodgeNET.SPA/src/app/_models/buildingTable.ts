import { Building } from './building';
import { BuildingType } from './buildingType';

export interface BuildingTable {
    buildingList: Building[];
    buildingTypeList: BuildingType[];
}
