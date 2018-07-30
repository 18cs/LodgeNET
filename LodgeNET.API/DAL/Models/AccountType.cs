using System.ComponentModel.DataAnnotations;

namespace LodgeNET.API.DAL.Models
{
    public class AccountType
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
    }
}