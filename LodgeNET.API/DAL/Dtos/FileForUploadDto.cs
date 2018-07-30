using Microsoft.AspNetCore.Http;

namespace LodgeNET.API.DAL.Dtos
{
    public class FileForUploadDto
    {
        public IFormFile File { get; set; }
        
    }
}