using System.ComponentModel.DataAnnotations;

namespace LodgeNET.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 8, ErrorMessage = "You must specify a password between 8 and 15 characters.")]
        public string Password { get; set; }
        public int? DodId { get; set; }
        public int? RankId { get; set; }
        public int UserUnit { get; set; }
        public int AccountTypeId { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public bool Approved { get; set; }
        public string Email { get; set; }
        public string CommPhone { get; set; }
        public string DsnPhone { get; set; }
    }
}