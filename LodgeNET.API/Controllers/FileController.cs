using System.Collections;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LodgeNET.API.BLL;
using LodgeNET.API.DAL.Dtos;
using LodgeNET.API.Utilities.IO.FileIO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NPOI.SS.UserModel;

namespace LodgeNET.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private FileReader _fileReader;
        private FileService _fileService;
        public FileController(
            IHostingEnvironment environment,
            FileReader fr,
            FileService fileService)
        {
            _hostingEnvironment = environment;
            _fileReader = fr;
            _fileService = fileService;
        }

        [HttpPost("unaccompaniedFile")]
        public async Task<IActionResult> UploadUnaccompaniedFile(int userId, FileForUploadDto fileDto)
        {
            ArrayList returnRows = new ArrayList();
            IFormFile file = Request.Form.Files[0];
            string folderName = "Upload";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = System.IO.Path.Combine(webRootPath, folderName);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (file.Length > 0)
            {
                string sFileExtension = System.IO.Path.GetExtension(file.FileName).ToLower();
                string fullPath = System.IO.Path.Combine(newPath, file.FileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                var sheet = _fileReader.GetExcelSheet(fullPath);
                var headers = _fileReader.GetExcelSheetHeaders(sheet);

                for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) //Read Excel File
                {
                    IRow row = sheet.GetRow(i);
                    if (row == null || row.Cells.All(d => d.CellType == CellType.Blank)) continue;

                    var rowForUpload = await _fileService.ParseUnaccompaniedExcelRow(row, headers);

                    //stay buildingId is nullable
                    if (rowForUpload.RoomId == 0 ||
                        rowForUpload.BuildingId == 0 ||
                        rowForUpload.FirstName == null ||
                        rowForUpload.LastName == null ||
                        rowForUpload.UnitId == 0)
                    {
                        returnRows.Add(rowForUpload);
                    }
                    else
                    {
                        await _fileService.SaveFileRowAsync(rowForUpload);
                    }
                }

                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            return Ok(returnRows);
        }


        [HttpPost("DataRows")]
        public async Task<IActionResult> UploadUnaccompaniedData(int userId, [FromBody] FileRowForUploadDto[] fileRows)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0)
            {
                return Unauthorized();
            }

            ArrayList returnRows = new ArrayList();

            foreach (FileRowForUploadDto fileRow in fileRows)
            {
                //TODOTEST
                await _fileService.ParseDataRow(fileRow);

                if (fileRow.RoomId == 0 ||
                    fileRow.BuildingId == 0 ||
                    fileRow.FirstName == null ||
                    fileRow.LastName == null)
                {
                    returnRows.Add(fileRow);
                }
                else
                {
                    //TODO add unit parse
                    await _fileService.SaveFileRowAsync(fileRow);
                }
            }
            return Ok(returnRows);
        }

        [HttpPost("manifestFile")]
        public async Task<IActionResult> ManifestFile(int userId, FileForUploadDto fileDto)
        {
            // var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // if (currentUserId == 0)
            // {
            //     return Unauthorized();
            // }
            // ArrayList returnRows = new ArrayList();
            // IFormFile file = Request.Form.Files[0];

            // string folderName = "Upload";
            // string webRootPath = _hostingEnvironment.WebRootPath;
            // string newPath = System.IO.Path.Combine(webRootPath, folderName);
            // if (!Directory.Exists(newPath))
            // {
            //     Directory.CreateDirectory(newPath);
            // }
            // if (file.Length > 0)
            // {
            //     string sFileExtension = System.IO.Path.GetExtension(file.FileName).ToLower();
            //     string fullPath = System.IO.Path.Combine(newPath, file.FileName);
            //     using (var stream = new FileStream(fullPath, FileMode.Create))
            //     {
            //         file.CopyTo(stream);
            //     }

            //     var sheets = _fileReader.GetExcelSheets(fullPath);
            //     foreach (var sheet in sheets)
            //     {
            //         var headers = _fileReader.GetExcelSheetHeaders(sheet, 3);

            //         if (!headers.Contains("Personal ID")) continue;

            //         for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) //Read Excel File
            //         {
            //             IRow row = sheet.GetRow(i);
            //             if (row == null || row.Cells.All(d => d.CellType == CellType.Blank)) continue;

            //             var rowForUpload = await _fileService.ParseManifestExcelRow(row, headers);

            //             //if (rowForUpload == null) continue;

            //             //stay buildingId is nullable
            //             if (rowForUpload.RoomId == 0 ||
            //                 rowForUpload.BuildingId == 0 ||
            //                 rowForUpload.FirstName == null ||
            //                 rowForUpload.LastName == null ||
            //                 rowForUpload.UnitId == 0)
            //             {
            //                 returnRows.Add(rowForUpload);
            //             }
            //             else
            //             {
            //                 await _fileService.SaveFileRowAsync(rowForUpload);
            //             }
            //         }
            //     }

            //     if (System.IO.File.Exists(fullPath))
            //     {
            //         System.IO.File.Delete(fullPath);
            //     }
            // }
            // return Ok(returnRows);
            return Ok();

        }

        [HttpPost("lodgingFile")]
        public async Task<IActionResult> UploadLodgingFile(int userId, FileForUploadDto fileDto)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0)
            {
                return Unauthorized();
            }
            ArrayList returnRows = new ArrayList();

            var file = fileDto.File;
            if (file.Length > 0)
            {
                var guestStays = _fileReader.GetPdfText(file);

                foreach (string guestStay in guestStays)
                {
                    var rowForUpload = _fileService.ParseDlsReportRow(guestStay).Result;
                    if (rowForUpload == null)
                        continue;

                    if (rowForUpload.RoomId == 0 ||
                        rowForUpload.BuildingId == 0 ||
                        rowForUpload.FirstName == null ||
                        rowForUpload.LastName == null ||
                        rowForUpload.CheckInDate == null ||
                        rowForUpload.CheckOutDate == null)
                    {
                        returnRows.Add(rowForUpload);
                    }
                    else
                    {
                        await _fileService.SaveFileRowAsync(rowForUpload);
                    }
                }
            }
            return Ok(returnRows);
        }
    }
}
