namespace LodgeNET.API.Helpers
{
    public class UnitUserParams : PagUserParams
    {
        public int? UnitId { get; set; }
        public int? ParentUnitId { get; set; }
        public bool IncludeParentUnit { get; set; }
    }
}