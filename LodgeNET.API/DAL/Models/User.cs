using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public int? DodId { get; set; }
        public int? RankId { get; set; }
        [ForeignKey("RankId")]
        public Rank Rank { get; set; }
        public int? UnitId { get; set; }
        [ForeignKey("UnitId")]
        public Unit Unit { get; set; }
        public int AccountTypeId { get; set; }
        [ForeignKey("AccountTypeId")]
        public AccountType AccountType { get; set; }
        public string FirstName { get; set; }
        [MaxLength(1)]
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public bool Approved { get; set; }
        public string Email { get; set; }
        public string CommPhone { get; set; }
        public string DsnPhone { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string UserName { get; set; }
    }
}