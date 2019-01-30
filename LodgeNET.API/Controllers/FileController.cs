using System;
using System.Collections;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LodgeNET.API.BLL;
using LodgeNET.API.Dtos;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Helpers;
using LodgeNET.API.Utilities.IO.FileIO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NPOI.SS.UserModel;

namespace LodgeNET.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class FileController : Controller {
        private readonly IHostingEnvironment _hostingEnvironment;
        private FileReader _fileReader;
        private FileService _fileService;
        public FileController (
            IHostingEnvironment environment,
            FileReader fr,
            FileService fileService) {
            _hostingEnvironment = environment;
            _fileReader = fr;
            _fileService = fileService;
        }

        [HttpPost ("unaccompaniedFile")]
        public async Task<IActionResult> UploadUnaccompaniedFile (int userId, FileForUploadDto fileDto, UploadUserParams userParams) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0) {
                return Unauthorized ();
            }

            ArrayList returnRows = new ArrayList ();
            IFormFile file = Request.Form.Files[0];
            string folderName = "Upload";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = System.IO.Path.Combine (webRootPath, folderName);
            if (!Directory.Exists (newPath)) {
                Directory.CreateDirectory (newPath);
            }
            if (file.Length > 0) {
                var uploadToAdd = new Upload ();
                uploadToAdd.FileName = fileDto.File.FileName;
                uploadToAdd.DateUploaded = DateTime.Now;
                uploadToAdd.UserId = currentUserId;
                uploadToAdd.GuestsAdded = 0;
                
                int uploadId = await _fileService.AddUpload(uploadToAdd);

                string sFileExtension = System.IO.Path.GetExtension (file.FileName).ToLower ();
                string fullPath = System.IO.Path.Combine (newPath, file.FileName);
                using (var stream = new FileStream (fullPath, FileMode.Create)) {
                    file.CopyTo (stream);
                }

                var sheet = _fileReader.GetExcelSheet (fullPath);
                var headers = _fileReader.GetExcelSheetHeaders (sheet);

                for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) //Read Excel File
                {
                    IRow row = sheet.GetRow (i);
                    if (row == null || row.Cells.All (d => d.CellType == CellType.Blank)) continue;

                    var rowForUpload = await _fileService.ParseUnaccompaniedExcelRow (row, headers, uploadId);

                    //stay buildingId is nullable
                    if (rowForUpload.RoomId == 0 ||
                        rowForUpload.BuildingId == 0 ||
                        rowForUpload.FirstName == null ||
                        rowForUpload.LastName == null ||
                        rowForUpload.UnitId == 0) {
                        returnRows.Add (rowForUpload);
                    } else {
                        await _fileService.SaveFileRowAsync (rowForUpload);
                        uploadToAdd.GuestsAdded += 1;
                    }
                }

                await _fileService.SaveUpload(uploadToAdd);

                if (System.IO.File.Exists (fullPath)) {
                    System.IO.File.Delete (fullPath);
                }
            }
            return Ok (returnRows);
        }

        [HttpPost ("DataRows")]
        public async Task<IActionResult> DataRows (int userId, [FromBody] FileRowForUploadDto[] fileRows, [FromQuery]UploadUserParams userParams) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0) {
                return Unauthorized ();
            }

            ArrayList returnRows = new ArrayList ();

            int uploadKickbacksId = fileRows[0].UploadId ?? default(int);

            var uploadKickbacks = await _fileService.GetUploadById(uploadKickbacksId);

            foreach (FileRowForUploadDto fileRow in fileRows) {
                //TODOTEST
                await _fileService.ParseDataRow (fileRow);

                if (fileRow.RoomId == 0 ||
                    fileRow.BuildingId == 0 ||
                    fileRow.FirstName == null ||
                    fileRow.LastName == null) {
                    returnRows.Add (fileRow);
                } else {
                    //TODO add unit parse
                    await _fileService.SaveFileRowAsync (fileRow);
                    uploadKickbacks.GuestsAdded += 1;
                }
            }

            await _fileService.SaveUpload(uploadKickbacks);

            return Ok (returnRows);
        }

        [HttpPost("exmanifestfile")]
        public async Task<IActionResult> UploadExManifestFile(int userId, FileForUploadDto fileDto, [FromQuery] ManifestFileUploadUserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0)
            {
                return Unauthorized();
            }

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
                var uploadToAdd = new Upload ();
                uploadToAdd.FileName = fileDto.File.FileName;
                uploadToAdd.DateUploaded = DateTime.Now;
                uploadToAdd.UserId = currentUserId;
                uploadToAdd.GuestsAdded = 0;
                
                int uploadId = await _fileService.AddUpload(uploadToAdd);

                string sFileExtension = System.IO.Path.GetExtension(file.FileName).ToLower();
                string fullPath = System.IO.Path.Combine(newPath, file.FileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                var sheets = _fileReader.GetExcelSheets(fullPath);
                foreach (var sheet in sheets)
                {
                    var headers = _fileReader.GetExcelSheetHeaders(sheet, 2);

                    if (!headers.Contains("PERSONAL ID")) continue;

                    for (int i = (sheet.FirstRowNum + 3); i <= sheet.LastRowNum; i++) //Read Excel File
                    {
                        IRow row = sheet.GetRow(i);
                        if (row == null || 
                            row.Cells.All(d => d.CellType == CellType.Blank) ||
                            row.GetCell(0).StringCellValue.IndexOf("For Official Use", StringComparison.OrdinalIgnoreCase) >= 0 ) continue;

                        var rowForUpload = await _fileService.ParseExManifestExcelRow(row, headers, uploadId);

                        if (rowForUpload == null) continue;

                        //stay buildingId is nullable
                        if (rowForUpload.Gender == null ||
                            rowForUpload.FirstName == null ||
                            rowForUpload.LastName == null ||
                            rowForUpload.UnitId == 0)
                        {
                            returnRows.Add(rowForUpload);
                        }
                        else
                        {
                            rowForUpload = await _fileService.AutoRoomDataRow(rowForUpload, userParams);
                            await _fileService.SaveFileRowAsync(rowForUpload);
                            uploadToAdd.GuestsAdded += 1;
                        }
                    }
                }

                await _fileService.SaveUpload(uploadToAdd);

                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            return Ok(returnRows);
        }

         [HttpPost ("manifestDataRows")]
        public async Task<IActionResult> ExManifestDataRows (int userId, [FromBody] FileRowForUploadDto[] fileRows, [FromQuery]ManifestFileUploadUserParams userParams) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0) {
                return Unauthorized ();
            }

            ArrayList returnRows = new ArrayList ();

            int uploadKickbacksId = fileRows[0].UploadId ?? default(int);

            var uploadKickbacks = await _fileService.GetUploadById(uploadKickbacksId);

            foreach (FileRowForUploadDto fileRow in fileRows) {
                //TODOTEST
                //await _fileService.SaveNewGuestFileRowAsync (fileRow, userParams);

                if (fileRow.Gender == null ||
                    fileRow.UnitId == 0 ||
                    fileRow.FirstName == null ||
                    fileRow.LastName == null) {
                    returnRows.Add (fileRow);
                } else {
                    //TODO add unit parse
                    var fileRowForUpload = await _fileService.AutoRoomDataRow(fileRow, userParams);
                    await _fileService.SaveFileRowAsync (fileRowForUpload);
                    uploadKickbacks.GuestsAdded += 1;
                }
            }

            await _fileService.SaveUpload(uploadKickbacks);

            return Ok (returnRows);
        }

        [HttpPost("lodgingFile")]
        public async Task<IActionResult> UploadLodgingFile(int userId, FileForUploadDto fileDto)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0) {
                return Unauthorized ();
            }
            ArrayList returnRows = new ArrayList ();

            var uploadToAdd = new Upload ();
            uploadToAdd.FileName = fileDto.File.FileName;
            uploadToAdd.DateUploaded = DateTime.Now;
            uploadToAdd.UserId = currentUserId;
            uploadToAdd.GuestsAdded = 0;
            
            int uploadId = await _fileService.AddUpload(uploadToAdd);


            var file = fileDto.File;
            if (file.Length > 0) {
                var guestStays = _fileReader.GetPdfText (file);

                foreach (string guestStay in guestStays) {
                    var rowForUpload = _fileService.ParseDlsReportRow (guestStay, uploadId).Result;
                    if (rowForUpload == null)
                        continue;

                    if (rowForUpload.RoomId == 0 ||
                        rowForUpload.BuildingId == 0 ||
                        rowForUpload.FirstName == null ||
                        rowForUpload.LastName == null ||
                        rowForUpload.CheckInDate == null ||
                        rowForUpload.CheckOutDate == null) {
                        returnRows.Add (rowForUpload);
                    } else {
                        await _fileService.SaveFileRowAsync (rowForUpload);
                        uploadToAdd.GuestsAdded += 1;
                    }
                }

                await _fileService.SaveUpload(uploadToAdd);
            }
            return Ok (returnRows);
        }

        [HttpGet ("getuploadspagination")]
        public async Task<IActionResult> GetUploadsPagination ([FromQuery] UploadUserParams userParams) {
            var uploads = await _fileService.GetUploadsPagination (userParams);

            Response.AddPagination (uploads.CurrentPage,
                uploads.PageSize,
                uploads.TotalCount,
                uploads.TotalPages);

            return Ok (uploads);
        }

        [HttpDelete ("upload/{id}")]
        public async Task<IActionResult> DeleteUpload (int id) {
            await _fileService.DeleteUpload (id);

            return Ok ();
        }
    }
}