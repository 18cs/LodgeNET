using Microsoft.AspNetCore.Http;

namespace LodgeNET.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Applciation-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            
        }
    }
}