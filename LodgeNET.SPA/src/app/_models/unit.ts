export interface Unit {
    id: number;
    name: string;
    parentUnit?: Unit;
    parentUnitId?: number;
    unitAbbreviation?: string;
}
