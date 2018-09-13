namespace LodgeNET.API.Helpers
{
    public class UnitUserParams : PagUserParams
    {
        public int? UnitId { get; set; }
        public int? ParentUnitId { get; set; }
        public bool IncludeParentUnit { get; set; }
        public string UnitName { get; set; }
        public string UnitAbbreviation { get; set; }
    }
}