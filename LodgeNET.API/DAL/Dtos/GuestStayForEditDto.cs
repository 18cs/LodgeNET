using System;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL.Dtos
{
    public class GuestStayForEditDto
    {
        //REVIEW FOR REMOVE, SAME AS STAY DATA MODEL
        
        public int Id { get; set; }
        public int GuestId { get; set; }     
        public Guest Guest { get; set; }
        public int RoomId { get; set; }
        public Room Room { get; set; }
        public int? BuildingId { get; set; }
        public Building Building { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public bool Canceled { get; set; }
        public bool CheckedIn { get; set; }
        public bool CheckedOut { get; set; }
        public DateTime DateCreated { get; set; }
    }
}