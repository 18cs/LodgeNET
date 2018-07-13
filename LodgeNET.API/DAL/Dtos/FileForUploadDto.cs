using Microsoft.AspNetCore.Http;

namespace LodgeNET.API.Dtos
{
    public class FileForUploadDto
    {
        public IFormFile File { get; set; }
        
    }
}