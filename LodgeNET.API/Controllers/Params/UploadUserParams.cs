using System;

namespace LodgeNET.API.Helpers
{
    public class UploadUserParams : PagUserParams
    {
        public int? UserId { get; set; }
        public string FileName { get; set; }
        public DateTime? DateUploaded { get; set; }   
        public int UploadId { get; set; }     
    }
}