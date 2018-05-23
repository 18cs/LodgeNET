namespace LodgeNET.API.Helpers
{
    public class UserUserParams : PagUserParams
    {
        public int? AccountTypeId { get; set; }
        public string UserName { get; set; }
        public bool? Approved { get; set; }        
    }
}