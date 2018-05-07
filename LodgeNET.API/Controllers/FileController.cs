using System;
using System.Collections;
using System.Globalization;
using System.IO;
using System.Linq;
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
        private IMapper _mapper;
        private readonly IHostingEnvironment _hostingEnvironment;

        public FileController (
            IGenericRepository<User> userRepo,
            IGenericRepository<Room> roomRepo,
            IGenericRepository<Rank> rankRepo,
            IGenericRepository<Guest> guestRepo,
            IGenericRepository<Stay> stayRepo,
            IGenericRepository<Building> buildingRepo,
            IMapper mapper,
            IHostingEnvironment environment) {
            _userRepo = userRepo;
            _roomRepo = roomRepo;
            _rankRepo = rankRepo;
            _guestRepo = guestRepo;
            _stayRepo = stayRepo;
            _buildingRepo = buildingRepo;
            _hostingEnvironment = environment;
            _mapper = mapper;
        }

        [HttpPost ("unaccompanied")]
        public async Task<IActionResult> UploadUnaccompaniedOccupancy (int userId, FileForUploadDto fileDto) {
            ArrayList headers = new ArrayList ();
            ArrayList returnRows = new ArrayList();

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
                        headers.Add (cell.ToString ().Trim().ToUpper());
                    }

                    for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) //Read Excel File
                    {
                        var rowForUpload = new RowForUploadDto();
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

                            if (headers[j].Equals ("BLDG") && rowForUpload.BuildingId == 0)
                                rowForUpload.BuildingNumber = row.GetCell (j).ToString ();
                                rowForUpload.BuildingId = _buildingRepo.GetFirstOrDefault (b => b.Number == int.Parse (row.GetCell (j).ToString ()))?.Result?.Id ?? 0;

                            if (headers[j].Equals ("ROOM")) 
                            {
                                rowForUpload.RoomNumber = row.GetCell (j).ToString ();
                                if (rowForUpload.BuildingId == 0) 
                                {
                                    var bldgIndex = headers.IndexOf("BLDG");

                                    if (bldgIndex == -1) 
                                    {
                                        continue;
                                    }

                                    var rowBldgNum = int.Parse (row.GetCell (bldgIndex).ToString ());
                                    var buildingResult = _buildingRepo.GetFirstOrDefault (b => b.Number == rowBldgNum)?.Result;

                                    if (buildingResult != null) 
                                    {
                                        rowForUpload.BuildingId = buildingResult.Id;
                                    }    
                                }

                                if (rowForUpload.BuildingId == 0){
                                    int rowRoomNum = int.Parse (row.GetCell (j).ToString ());
                                    var yup = _roomRepo.GetFirstOrDefault (r => r.RoomNumber == rowRoomNum && r.BuildingId == rowForUpload.BuildingId)?.Result;
                                    rowForUpload.RoomId = _roomRepo.GetFirstOrDefault (r => r.RoomNumber == rowRoomNum && r.BuildingId == rowForUpload.BuildingId)?.Result?.Id ?? 0;
                                }
                            }
                        }

                        //stay buildingId is nullable
                        if(rowForUpload.RoomId == 0 || rowForUpload.BuildingId == 0) {
                            // ModelState.AddModelError("BadFormat", "File upload failed");
                            // return BadRequest(ModelState);
                            returnRows.Add(rowForUpload);
                        }
                        else
                        {
                            //TODO add unit parse
                            var guest = new Guest ();
                            var stay = new Stay () {
                                DateCreated = DateTime.Today,
                                CheckInDate = DateTime.Today,
                                CheckedIn = true,
                            };
                            guest = _mapper.Map<Guest>(rowForUpload);
                            stay = _mapper.Map<Stay>(rowForUpload);

                            _guestRepo.Insert(guest);
                            _stayRepo.Insert(stay);
                        }

                    }
                }
                // _guestRepo.SaveAsync();
                // _stayRepo.SaveAsync();
            }
            return Ok (returnRows);
        }

        [HttpPost ("lodging")]
        public async Task<IActionResult> UploadLodgeingOccupancy (int userId, FileForUploadDto fileDto) {
            // var user = await _userRepo.GetByID(1);

            // if (user == null) {
            //     return BadRequest ("Server could not authenticate");
            // }

            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId == 0) {
                return Unauthorized ();
            }

            var file = fileDto.File;
            if (file.Length > 0) {
                using (PdfReader reader = new PdfReader (file.OpenReadStream ())) {
                    StringBuilder text = new StringBuilder ();

                    for (int i = 1; i <= reader.NumberOfPages; i++) {
                        //text.Append (PdfTextExtractor.GetTextFromPage (reader, i));
                        string[] guestStays = PdfTextExtractor.GetTextFromPage (reader, i).Split ("\n");
                        foreach (string guestStay in guestStays) {
                            if (!Regex.Match (guestStay, @"^\d").Success) {
                                continue;
                            }

                            string[] stayData = guestStay.Split (" ");
                            int firstnameIndex = 0;

                            var guest = new Guest ();
                            var stay = new Stay ();

                            var rooms = _roomRepo.GetAsync (r => r.RoomNumber == int.Parse (stayData[0]));

                            foreach (Room room in rooms.Result) {
                                stay.RoomId = room.Id;
                                stay.BuildingId = room.BuildingId;
                            }

                            //removes tailing ',' from lastname
                            guest.LastName = stayData[1].Remove (stayData[1].Length - 1).ToUpper ();

                            var ranks = await _rankRepo.GetAsync (r => r.RankName.Equals (stayData[2]));
                            Rank rank = null;
                            foreach (var r in ranks) {
                                rank = r;
                            }

                            //Indices of the data are not static, they vary depending on the data included
                            //if index was not rank, check if followinging index is MI or account number
                            //meaning the rank was not include. The else means that the rank was included but was not found in DB
                            if (rank == null && (stayData[3].Length == 1 || Regex.Match (stayData[3], @"^\d").Success)) {
                                guest.FirstName = stayData[2].ToUpper ();
                                firstnameIndex = 2;
                            } else {
                                guest.FirstName = stayData[3].ToUpper ();
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
                                    stay.CheckedIn = true;
                                    stay.CheckInDate = checkInDate;
                                    stay.CheckOutDate = DateTime.Parse (stayData[j + 1]);
                                    break;
                                }
                            }
                            _guestRepo.Insert (guest);
                            _guestRepo.Save ();
                            stay.GuestId = guest.Id;
                            _stayRepo.Insert (stay);
                            _stayRepo.Save ();

                        }
                    }
                }
            }

            return Ok ();
        }
    }
}