using System;
using System.Collections;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.DAL.Dtos;
using LodgeNET.API.DAL.Models;
using NPOI.SS.UserModel;

namespace LodgeNET.API.BLL
{
    public class FileService
    {
        private readonly IGenericRepository<Building> _buildingRepo;
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IUnitRepository _unitRepo;
        private readonly IGenericRepository<Guest> _guestRepo;
        private readonly IGenericRepository<Stay> _stayRepo;
        private readonly IGenericRepository<Rank> _rankRepo;
        private IMapper _mapper;
        public FileService(IGenericRepository<Building> buildingRepo,
                            IGenericRepository<Room> roomRepo,
                            IUnitRepository unitRepo,
                            IGenericRepository<Guest> guestRepo,
                            IGenericRepository<Stay> stayRepo,
                             IGenericRepository<Rank> rankRepo,
                            IMapper mapper)
        {
            _buildingRepo = buildingRepo;
            _roomRepo = roomRepo;
            _unitRepo = unitRepo;
            _guestRepo = guestRepo;
            _stayRepo = stayRepo;
            _rankRepo = rankRepo;
            _mapper = mapper;
        }
        public async Task<FileRowForUploadDto> ParseUnaccompaniedExcelRow(IRow row, ArrayList headers)
        {
            var rowForUpload = new FileRowForUploadDto();
            for (int j = row.FirstCellNum; j < headers.Count; j++)
            {
                if (row.GetCell(j) == null)
                    continue;

                if (headers[j].Equals("LAST NAME"))
                    rowForUpload.LastName = row.GetCell(j).ToString();

                if (headers[j].Equals("FIRST NAME"))
                    rowForUpload.FirstName = row.GetCell(j).ToString();

                if (headers[j].Equals("BLDG") && rowForUpload.BuildingId == 0)
                {
                    int.TryParse(row.GetCell(j).ToString(), out int rowBldgNum);
                    await ParseBuilding(rowBldgNum, rowForUpload);
                }

                if (headers[j].Equals("ROOM"))
                {
                    rowForUpload.RoomNumber = row.GetCell(j).ToString();
                    if (rowForUpload.BuildingId == 0)
                    {
                        var bldgIndex = headers.IndexOf("BLDG");

                        if (bldgIndex == -1)
                        {
                            continue;
                        }

                        int.TryParse(row.GetCell(bldgIndex).ToString(), out int rowBldgNum);
                        await ParseBuilding(rowBldgNum, rowForUpload);
                    }

                    if (rowForUpload.BuildingId != 0)
                    {
                        rowForUpload.RoomId = (await _roomRepo.GetFirstOrDefault(
                            r => r.RoomNumber == rowForUpload.RoomNumber &&
                            r.BuildingId == rowForUpload.BuildingId
                        ))?.Id ?? 0;
                    }
                }

                if (headers[j].Equals("UNIT NAME"))
                {
                    var unit = GetRowUnit(row.GetCell(j).ToString());
                    if (unit != null)
                    {
                        rowForUpload.UnitId = unit.Id;
                        rowForUpload.UnitName = unit.Name;
                    }
                }
            }
            return rowForUpload;
        }

        public async Task<FileRowForUploadDto> ParseDataRow(FileRowForUploadDto fileRow)
        {
            await ParseBuilding(fileRow.BuildingNumber, fileRow);

            if (fileRow.BuildingId != 0)
            {
                var roomResult = await _roomRepo.GetFirstOrDefault(r => r.RoomNumber == fileRow.RoomNumber &&
                   r.BuildingId == fileRow.BuildingId
                );
                fileRow.RoomId = roomResult != null ? roomResult.Id : 0;
            }

            if (fileRow.UnitName != null)
            {
                var unitResult = GetRowUnit(fileRow.UnitName);
                fileRow.UnitId = unitResult.Id;
                fileRow.UnitName = unitResult.Name;
            }

            return fileRow;
        }

        public async Task<FileRowForUploadDto> ParseDlsReportRow(string dataRow)
        {
            var rowForUpload = new FileRowForUploadDto();

            if (!Regex.Match(dataRow, @"^\d").Success)
                return null;

            string[] stayData = dataRow.Split(" ");

            await ParseDlsRoom(stayData[0], rowForUpload);
            
            rowForUpload.LastName = stayData[1];
            await ParseDlsRank(rowForUpload, stayData);
            
            //removes tailing ',' from lastname
            rowForUpload.LastName = rowForUpload.LastName.Remove(stayData[1].Length - 1).ToUpper();

            int firstnameIndex = ParseDlsFirstName(rowForUpload, stayData);

            //logic to find checkin and out date of row
            for (int j = firstnameIndex; j < stayData.Length; j++)
            {
                if (DateTime.TryParseExact(
                        stayData[j],
                        "MM/dd/yyyy",
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.None,
                        out DateTime checkInDate))
                {
                    //TODO account for the open column
                    rowForUpload.CheckedIn = true;
                    rowForUpload.CheckInDate = checkInDate;
                    rowForUpload.CheckOutDate = DateTime.Parse(stayData[j + 1]);
                    break;
                }
            }
            return rowForUpload;
        }
        public async Task SaveFileRowAsync(FileRowForUploadDto rowForUpload)
        {
            //TODO add unit parse
            var guest = new Guest();
            var stay = new Stay();
            guest = _mapper.Map<Guest>(rowForUpload);
            stay = _mapper.Map<Stay>(rowForUpload);

            if (guest.UnitId == 0)
            {
                guest.UnitId = null;
            }

            if (guest.RankId == 0)
            {
                guest.RankId = null;
            }

            stay.CheckedIn = true;
            stay.DateCreated = DateTime.Today;
            if (DateTime.Compare(stay.CheckInDate, DateTime.MinValue) == 0)
            {
                stay.CheckInDate = DateTime.Today;
            }
            await _guestRepo.Insert(guest);
            await _guestRepo.SaveAsync();
            stay.GuestId = guest.Id;
            await _stayRepo.Insert(stay);
            await _stayRepo.SaveAsync();
        }

        private async Task ParseBuilding(int rowBldgNum, FileRowForUploadDto rowForUpload)
        {
            rowForUpload.BuildingNumber = rowBldgNum;
            rowForUpload.BuildingId = (await _buildingRepo.GetFirstOrDefault(b => b.Number == rowForUpload.BuildingNumber))?.Id ?? 0;
        }

        private Unit GetRowUnit(string unitName)
        {
            string[] unitNameSections = unitName.ToUpper().Split(" ");
            for (int n = 0; n < unitNameSections.Length; n++)
            {
                if (unitNameSections[n].Equals("SQ"))
                {
                    unitNameSections[n] = "SQUADRON";
                }

                if (unitNameSections[n].Equals("GP"))
                {
                    unitNameSections[n] = "GROUP";
                }

                if (unitNameSections[n].Equals("WG"))
                {
                    unitNameSections[n] = "WING";
                }

                if (unitNameSections[n].Equals("OPS"))
                {
                    unitNameSections[n] = "OPERATIONS";
                }

                if (unitNameSections[n].Equals("SPT"))
                {
                    unitNameSections[n] = "SUPPORT";
                }
            }

            return _unitRepo.GetFirst(u => unitNameSections.All(u.Name.ToUpper().Contains));
        }

        private async Task ParseDlsRoom(string roomNumber, FileRowForUploadDto rowForUpload)
        {
            var room = await _roomRepo.GetFirstOrDefault(
                                    r => r.RoomNumber.Equals(roomNumber,StringComparison.CurrentCultureIgnoreCase) 
                                            && r.Building.BuildingCategory.Type.Equals("Lodging"),
                                    new Expression<Func<Room, object>>[] { r => r.Building });

            if (room != null)
            {
                rowForUpload.RoomId = room.Id;
                rowForUpload.RoomNumber = room.RoomNumber;
                rowForUpload.BuildingId = room.BuildingId;
                rowForUpload.BuildingNumber = room.Building.Number;
            }
            // return rowForUpload;
        }

        private async Task ParseDlsRank(FileRowForUploadDto rowForUpload, string[] stayData)
        {
            Rank rank;
            // accounts to spaced (two) last names
            // in file, last name is always followed by a comma
            if (rowForUpload.LastName.EndsWith(','))
            {
                var retrievedRank = await _rankRepo.GetFirstOrDefault(r => r.RankName.Equals(stayData[2]));
                rank = retrievedRank;
            }
            else
            {
                var retrievedRank = await _rankRepo.GetFirstOrDefault(r => r.RankName.Equals(stayData[3]));
                rank = retrievedRank;
            }

            if (rank != null)
            {
                rowForUpload.RankId = rank.Id;
            }
        }

        private int ParseDlsFirstName(FileRowForUploadDto rowForUpload, string[] stayData)
        {
            int firstnameIndex = 0;
            //Indices of the data are not static, they vary depending on the data included
            //if index was not rank, check if followinging index is MI or account number
            //meaning the rank was not include. The else means that the rank was included but was not found in DB
            if (rowForUpload.RankId == null && (stayData[3].Length == 1 || Regex.Match(stayData[3], @"^\d").Success))
            {
                rowForUpload.FirstName = stayData[2].ToUpper();
                firstnameIndex = 2;
            }
            else
            {
                rowForUpload.FirstName = stayData[3].ToUpper();
                firstnameIndex = 3;
            }

            return firstnameIndex;
        }
    }
}
