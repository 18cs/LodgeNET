using System;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class FileController : Controller {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IGenericRepository<Rank> _rankRepo;
        private readonly IGenericRepository<Guest> _guestRepo;
        private readonly IGenericRepository<Reservation> _reservationRepo;
        private readonly IGenericRepository<Stay> _stayRepo;
        

        public FileController (
            IGenericRepository<User> userRepo,
            IGenericRepository<Room> roomRepo,
            IGenericRepository<Rank> rankRepo,
            IGenericRepository<Guest> guestRepo,
            IGenericRepository<Reservation> reservationRepo,
            IGenericRepository<Stay> stayRepo) {
            _userRepo = userRepo;
            _roomRepo = roomRepo;
            _rankRepo = rankRepo;
            _guestRepo = guestRepo;
            _stayRepo = stayRepo;
        }

        [HttpPost]
        public async Task<IActionResult> UploadLodgeingOccupancy (int userId, FileForUploadDto fileDto) {
            var user = await _userRepo.GetByID (userId);

            if (user == null) {
                return BadRequest ("Server could not authenticate");
            }

            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId != user.Id) {
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
                            string[] stayData = guestStay.Split (" ");
                             int firstnameIndex = 0;

                            var guest = new Guest ();
                            var stay = new Stay ();
                            var reservation = new Reservation ();
                            
                            stay.RoomId = _roomRepo.Get(r => r.RoomNumber == int.Parse(stayData[0])).Id;
                            
                            //removes tailing ',' from lastname
                            guest.LastName = stayData[1].Remove(stayData[1].Length - 1).ToUpper();

                            var rank = _rankRepo.Get(r => r.RankName == stayData[2]);

                            //Indices of the data are not static, they vary depending on the data included
                            //if index was not rank, check if followinging index is MI or account number
                            //meaning the rank was not include. The else means that the rank was included but was not found in DB
                            if(rank == null && (stayData[3].Length == 1 || Regex.Match(stayData[3], @"\\d.*").Success)) 
                            {
                                guest.FirstName = stayData[2].ToUpper();
                                firstnameIndex = 2;
                            }
                            else
                            {
                                guest.FirstName = stayData[3].ToUpper();
                                firstnameIndex = 3;
                            }

                            //logic to find checkin an dout date of row
                            for(int j = firstnameIndex; i < stayData.Length; i++)
                            {
                                if(Regex.Match(stayData[j], @"\\d.*").Success)
                                {
                                   stay.DateCheckedIn = DateTime.Parse(stayData[j+1]);
                                   reservation.CheckInDate = DateTime.Parse(stayData[j+1]);
                                   reservation.CheckOutDate = DateTime.Parse(stayData[j+2]);
                                }
                            }

                            _reservationRepo.Insert(reservation);
                            // _reservationRepo.Save();
                            stay.ReservationId = reservation.Id;
                            _guestRepo.Insert(guest);
                            stay.GuestId = guest.Id;
                            _stayRepo.Insert(stay);
                            
                        }
                    }

                    string yup = text.ToString ();
                }
            }

            return Ok ();
        }
    }
}