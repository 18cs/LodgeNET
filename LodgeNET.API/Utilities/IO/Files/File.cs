namespace LodgeNET.API.Utilities.IO.File
{
    public class File
    {
        public void CreateWebRootDirectory(string directoryName)
        {
            string folderName = "Upload";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = System.IO.Path.Combine (webRootPath, folderName);
            StringBuilder sb = new StringBuilder ();
            if (!Directory.Exists (newPath)) {
                Directory.CreateDirectory (newPath);
            }
        }
    }
}