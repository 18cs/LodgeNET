namespace LodgeNET.API.Helpers
{
    public class GuestUserParams : PagUserParams
    {
        public string LastName { get; set; }
        public int? RankId { get; set; }
        public string Gender { get; set; }
        public int? DodId { get; set; }
        public int? UnitId { get; set; }
    }
}