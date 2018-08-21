namespace LodgeNET.API.DAL.Dtos
{
    public class UserForDisplayDto
    {
        public string UserName { get; set; }
        public int? DodId { get; set; }
        public string Rank { get; set; }
        public string Unit { get; set; }
        public string AccountType { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public bool Approved { get; set; }
        public string Email { get; set; }
        public string CommPhone { get; set; }
        public string DsnPhone { get; set; }
    }
}