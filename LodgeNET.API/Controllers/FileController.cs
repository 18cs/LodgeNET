using System;
using System.Collections;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace LodgeNET.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class FileController : Controller {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IGenericRepository<Rank> _rankRepo;
        private readonly IGenericRepository<Guest> _guestRepo;
        private readonly IGenericRepository<Stay> _stayRepo;
        private readonly IGenericRepository<Building> _buildingRepo;
        private readonly IUnitRepository _unitRepo;
        private IMapper _mapper;
        private readonly IHostingEnvironment _hostingEnvironment;

        public FileController (
            IGenericRepository<User> userRepo,
            IGenericRepository<Room> roomRepo,
            IGenericRepository<Rank> rankRepo,
            IGenericRepository<Guest> guestRepo,
            IGenericRepository<Stay> stayRepo,
            IGenericRepository<Building> buildingRepo,
            IUnitRepository unitRepo,
            IMapper mapper,
            IHostingEnvironment environment) {
            _userRepo = userRepo;
            _roomRepo = roomRepo;
            _rankRepo = rankRepo;
            _guestRepo = guestRepo;
            _stayRepo = stayRepo;
            _buildingRepo = buildingRepo;
            _unitRepo = unitRepo;
            _hostingEnvironment = environment;
            _mapper = mapper;
        }

        [HttpPost ("unaccompaniedFile")]
        public async Task<IActionResult> UploadUnaccompaniedFile (int userId, FileForUploadDto fileDto) {
            ArrayList headers = new ArrayList ();
            ArrayList returnRows = new ArrayList ();

            IFormFile file = Request.Form.Files[0];
            string folderName = "Upload";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = System.IO.Path.Combine (webRootPath, folderName);
            StringBuilder sb = new StringBuilder ();
            if (!Directory.Exists (newPath)) {
                Directory.CreateDirectory (newPath);
            }
            if (file.Length > 0) {
                string sFileExtension = System.IO.Path.GetExtension (file.FileName).ToLower ();
                ISheet sheet;
                string fullPath = System.IO.Path.Combine (newPath, file.FileName);
                using (var stream = new FileStream (fullPath, FileMode.Create)) {
                    file.CopyTo (stream);
                    stream.Position = 0;
                    if (sFileExtension == ".xls") {
                        HSSFWorkbook hssfwb = new HSSFWorkbook (stream); //This will read the Excel 97-2000 formats  
                        sheet = hssfwb.GetSheetAt (0); //get first sheet from workbook  
                    } else {
                        XSSFWorkbook hssfwb = new XSSFWorkbook (stream); //This will read 2007 Excel format  
                        sheet = hssfwb.GetSheetAt (0); //get first sheet from workbook   
                    }
                    IRow headerRow = sheet.GetRow (0); //Get Header Row
                    int cellCount = headerRow.LastCellNum;
                    sb.Append ("<table class='table'><tr>");
                    for (int j = 0; j < cellCount; j++) {
                        NPOI.SS.UserModel.ICell cell = headerRow.GetCell (j);
                        if (cell == null || string.IsNullOrWhiteSpace (cell.ToString ())) continue;
                        headers.Add (cell.ToString ().Trim ().ToUpper ());
                    }

                    for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) //Read Excel File
                    {
                        var rowForUpload = new FileRowForUploadDto ();
                        IRow row = sheet.GetRow (i);
                        if (row == null) continue;
                        if (row.Cells.All (d => d.CellType == CellType.Blank)) continue;

                        for (int j = row.FirstCellNum; j < cellCount; j++) {
                            if (row.GetCell (j) == null)
                                continue;

                            if (headers[j].Equals ("LAST NAME"))
                                rowForUpload.LastName = row.GetCell (j).ToString ();

                            if (headers[j].Equals ("FIRST NAME"))
                                rowForUpload.FirstName = row.GetCell (j).ToString ();

                            if (headers[j].Equals ("BLDG") && rowForUpload.BuildingId == 0) {
                                int.TryParse (row.GetCell (j).ToString (), out int rowBldgNum);
                                rowForUpload.BuildingNumber = rowBldgNum;
                                rowForUpload.BuildingId = _buildingRepo.GetFirstOrDefault (b => b.Number == rowForUpload.BuildingNumber)?.Result?.Id ?? 0;
                            }

                            if (headers[j].Equals ("ROOM")) {
                                // int.TryParse (row.GetCell (j).ToString (), out int rowRoomNum);
                                rowForUpload.RoomNumber = row.GetCell (j).ToString ();
                                if (rowForUpload.BuildingId == 0) {
                                    var bldgIndex = headers.IndexOf ("BLDG");

                                    if (bldgIndex == -1) {
                                        continue;
                                    }

                                    int.TryParse (row.GetCell (bldgIndex).ToString (), out int rowBldgNum);
                                    rowForUpload.BuildingNumber = rowBldgNum;
                                    var buildingResult = _buildingRepo.GetFirstOrDefault (b => b.Number == rowForUpload.BuildingNumber)?.Result;

                                    if (buildingResult != null) {
                                        rowForUpload.BuildingId = buildingResult.Id;
                                    }
                                }

                                if (rowForUpload.BuildingId == 0) {
                                    rowForUpload.RoomId = _roomRepo.GetFirstOrDefault (
                                        r => r.RoomNumber == rowForUpload.RoomNumber &&
                                        r.BuildingId == rowForUpload.BuildingId
                                    )?.Result?.Id ?? 0;
                                }
                            }
                            if (headers[j].Equals ("UNIT NAME")) {
                                string[] unitNameSections = row.GetCell (j).ToString ().Split (" ");
                                for (int n = 0; n < unitNameSections.Length; n++) {
                                    if (unitNameSections[n].Equals ("SQ")) {
                                        unitNameSections[n] = "Squadron";
                                    }

                                    if (unitNameSections[n].Equals ("GP")) {
                                        unitNameSections[n] = "Group";
                                    }

                                    if (unitNameSections[n].Equals ("WG")) {
                                        unitNameSections[n] = "Wing";
                                    }
                                }

                                var unit = _unitRepo.GetFirst (u => unitNameSections.All (u.Name.Contains));
                                if (unit != null) {
                                    rowForUpload.UnitId = unit.Id;
                                    rowForUpload.UnitName = unit.Name;
                                }
                            }
                        }

                        //stay buildingId is nullable
                        if (rowForUpload.RoomId == 0 ||
                            rowForUpload.BuildingId == 0 ||
                            rowForUpload.FirstName == null ||
                            rowForUpload.LastName == null ||
                            rowForUpload.UnitId == 0) {

                            returnRows.Add (rowForUpload);
                        } else {
                            //TODO add unit parse
                            var guest = new Guest ();
                            var stay = new Stay () {
                                DateCreated = DateTime.Today,
                                CheckInDate = DateTime.Today,
                                CheckedIn = true,
                            };
                            guest = _mapper.Map<Guest> (rowForUpload);
                            stay = _mapper.Map<Stay> (rowForUpload);

                            await _guestRepo.Insert (guest);
                            await _stayRepo.Insert (stay);
                        }

                    }
                }
                await _guestRepo.SaveAsync ();
                await _stayRepo.SaveAsync ();

                if (System.IO.File.Exists (fullPath)) {
                    System.IO.File.Delete (fullPath);
                }
            }
            return Ok (returnRows);
        }

        [HttpPost ("DataRows")]
        public async Task<IActionResult> UploadUnaccompaniedData (int userId, [FromBody] FileRowForUploadDto[] fileRows) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0) {
                return Unauthorized ();
            }

            ArrayList returnRows = new ArrayList ();

            foreach (FileRowForUploadDto fileRow in fileRows) {
                var buildingResult = await _buildingRepo.GetFirstOrDefault (b => b.Number == fileRow.BuildingNumber);
                fileRow.BuildingId = buildingResult != null ? buildingResult.Id : 0;

                if (fileRow.BuildingId != 0) {
                    var roomResult = await _roomRepo.GetFirstOrDefault (r => r.RoomNumber == fileRow.RoomNumber &&
                        r.BuildingId == fileRow.BuildingId
                    );
                    fileRow.RoomId = roomResult != null ? roomResult.Id : 0;
                }

                if (fileRow.UnitName != null) {
                    var unitResult = await _unitRepo.GetFirstOrDefault (u => u.Name.ToUpper ().Equals (fileRow.UnitName.ToUpper ()));
                    fileRow.UnitId = unitResult != null ? unitResult.Id : 0;
                }

                if (fileRow.RoomId == 0 ||
                    fileRow.BuildingId == 0 ||
                    fileRow.FirstName == null ||
                    fileRow.LastName == null) {
                    returnRows.Add (fileRow);
                } else {
                    //TODO add unit parse
                    var guest = new Guest ();
                    var stay = new Stay () {
                        DateCreated = DateTime.Today,
                        CheckedIn = true
                    };

                    guest = _mapper.Map<Guest> (fileRow);
                    stay = _mapper.Map<Stay> (fileRow);

                    if (guest.UnitId == 0) {
                        guest.UnitId = null;
                    }

                    if (guest.RankId == 0) {
                        guest.RankId = null;
                    }

                    if (DateTime.Compare (stay.CheckInDate, DateTime.MinValue) == 0) {
                        stay.CheckInDate = DateTime.Today;
                    }

                    stay.CheckedIn = true;
                    await _guestRepo.Insert (guest);
                    await _guestRepo.SaveAsync ();
                    stay.GuestId = guest.Id;
                    await _stayRepo.Insert (stay);
                    await _stayRepo.SaveAsync ();
                }
            }
            return Ok (returnRows);
        }

        [HttpPost ("lodgingFile")]
        public async Task<IActionResult> UploadLodgeingFile (int userId, FileForUploadDto fileDto) {
            // var user = await _userRepo.GetByID(1);

            // if (user == null) {
            //     return BadRequest ("Server could not authenticate");
            // }

            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0) {
                return Unauthorized ();
            }
            ArrayList returnRows = new ArrayList ();

            var file = fileDto.File;
            if (file.Length > 0) {
                using (PdfReader reader = new PdfReader (file.OpenReadStream ())) {

                    for (int i = 1; i <= reader.NumberOfPages; i++) {
                        //text.Append (PdfTextExtractor.GetTextFromPage (reader, i));
                        string[] guestStays = PdfTextExtractor.GetTextFromPage (reader, i).Split ("\n");
                        foreach (string guestStay in guestStays) {

                            var rowForUpload = new FileRowForUploadDto ();

                            if (!Regex.Match (guestStay, @"^\d").Success) {
                                continue;
                            }

                            string[] stayData = guestStay.Split (" ");
                            int firstnameIndex = 0;

                            //int.TryParse (stayData[0], out int rowRoomNum);
                            var room = await _roomRepo.GetFirstOrDefault (
                                r => r.RoomNumber == stayData[0] && r.Building.BuildingCategory.Type.Equals ("Lodging"),
                                new Expression<Func<Room, object>>[] { r => r.Building });

                            if (room != null) {
                                rowForUpload.RoomId = room.Id;
                                rowForUpload.RoomNumber = room.RoomNumber;
                                rowForUpload.BuildingId = room.BuildingId;
                                rowForUpload.BuildingNumber = room.Building.Number;
                            }

                            //removes tailing ',' from lastname
                            //rowForUpload.LastName = stayData[1].Remove (stayData[1].Length - 1).ToUpper ();

                            rowForUpload.LastName = stayData[1];

                            Rank rank;
                            // accounts to spaced (two) last names
                            if (rowForUpload.LastName.EndsWith (',')) {
                                var retrievedRank = await _rankRepo.GetFirstOrDefault (r => r.RankName.Equals (stayData[2]));
                                rank = retrievedRank;
                            } else {
                                var retrievedRank = await _rankRepo.GetFirstOrDefault (r => r.RankName.Equals (stayData[3]));
                                rank = retrievedRank;
                            }

                            //removes tailing ',' from lastname
                            rowForUpload.LastName = rowForUpload.LastName.Remove (stayData[1].Length - 1).ToUpper ();

                            //var rank = await _rankRepo.GetFirstOrDefault (r => r.RankName.Equals (stayData[2]));
                            // Rank rank = null;
                            // foreach (var r in ranks) {
                            //     rank = r;
                            // }

                            if (rank != null) {
                                rowForUpload.RankId = rank.Id;
                            }

                            //Indices of the data are not static, they vary depending on the data included
                            //if index was not rank, check if followinging index is MI or account number
                            //meaning the rank was not include. The else means that the rank was included but was not found in DB
                            if (rank == null && (stayData[3].Length == 1 || Regex.Match (stayData[3], @"^\d").Success)) {
                                rowForUpload.FirstName = stayData[2].ToUpper ();
                                firstnameIndex = 2;
                            } else {
                                rowForUpload.FirstName = stayData[3].ToUpper ();
                                firstnameIndex = 3;
                            }

                            //logic to find checkin an dout date of row
                            for (int j = firstnameIndex; j < stayData.Length; j++) {
                                if (DateTime.TryParseExact (
                                        stayData[j],
                                        "MM/dd/yyyy",
                                        CultureInfo.InvariantCulture,
                                        DateTimeStyles.None,
                                        out DateTime checkInDate)) {
                                    //TODO account for the open column
                                    rowForUpload.CheckedIn = true;
                                    rowForUpload.CheckInDate = checkInDate;
                                    rowForUpload.CheckOutDate = DateTime.Parse (stayData[j + 1]);
                                    break;
                                }
                            }

                            // rowForUpload.RoomId = 0;

                            if (rowForUpload.RoomId == 0 ||
                                rowForUpload.BuildingId == 0 ||
                                rowForUpload.FirstName == null ||
                                rowForUpload.LastName == null ||
                                rowForUpload.CheckInDate == null ||
                                rowForUpload.CheckOutDate == null) {
                                // ModelState.AddModelError("BadFormat", "File upload failed");
                                // return BadRequest(ModelState);
                                returnRows.Add (rowForUpload);
                            } else {
                                //TODO add unit parse
                                var guest = new Guest ();
                                var stay = new Stay () {
                                    DateCreated = DateTime.Today,
                                    CheckInDate = DateTime.Today,
                                    CheckedIn = true,
                                };
                                guest = _mapper.Map<Guest> (rowForUpload);

                                if (guest.UnitId == 0) {
                                    guest.UnitId = null;
                                }

                                if (guest.RankId == 0) {
                                    guest.RankId = null;
                                }

                                stay = _mapper.Map<Stay> (rowForUpload);

                                await _guestRepo.Insert (guest);
                                await _guestRepo.SaveAsync ();
                                stay.GuestId = guest.Id;
                                await _stayRepo.Insert (stay);
                                await _stayRepo.SaveAsync ();
                            }
                        }
                    }
                }
            }
            return Ok (returnRows);
        }
    }
}