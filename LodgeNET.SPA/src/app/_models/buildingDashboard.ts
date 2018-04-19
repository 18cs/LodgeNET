import { Building } from './building';
import { BuildingType } from './buildingType';

export interface BuildingDashboard {
    buildingList: Building[];
    buildingTypeList: BuildingType[];
}
