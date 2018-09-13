namespace LodgeNET.API.Helpers
{
    public class ManifestFileUploadUserParams : UploadUserParams
    {
        public int? BuildingId { get; set; }
        public int? BuildingTypeId { get; set; }
    }
}