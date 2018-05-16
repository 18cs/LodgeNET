namespace LodgeNET.API.Helpers
{
    public class RoomUserParams : PagUserParams
     {
    //     private const int MaxPageSize = 50;
    //     public int PageNumber { get; set; } = 1;
    //     private int pageSize = 10;
    //     public int PageSize
    //     {
    //         get { return pageSize; }
    //         set { pageSize = (value > MaxPageSize)? MaxPageSize : value; }
    //     }

        public int BuildingId { get; set; }
        public bool OnlyAvailableRooms { get; set; }
    }
}