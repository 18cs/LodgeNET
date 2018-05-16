namespace LodgeNET.API.Helpers
{
    public class PagUserParams
    {
        protected const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        protected int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize)? MaxPageSize : value; }
        }
    }
}