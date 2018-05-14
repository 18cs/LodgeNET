using LodgeNET.API.Models;

namespace LodgeNET.API.Dtos
{
    public class UserForEditDto
    {
        public int? DodId { get; set; }
        public int? ServiceId { get; set; }
        public int? RankId { get; set; }
        // [ForeignKey("RankId")]
        public int? UnitId { get; set; }
        // [ForeignKey("UnitId")]
        // public Unit Unit { get; set; }
        public int AccountTypeId { get; set; }
        // [ForeignKey("AccountTypeId")]
        public AccountType AccountType { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public bool Approved { get; set; }
        public string Email { get; set; }
        public string CommPhone { get; set; }
        public string DsnPhone { get; set; }
        public string UserName { get; set; }
    }
}