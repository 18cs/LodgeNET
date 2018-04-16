using System.Security.Claims;
using System.Threading.Tasks;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System.Text;

namespace LodgeNET.API.Controllers {
        [Authorize]
        [Route ("api/[controller]")]
        public class FileController : Controller {
            private readonly IGenericRepository<User> _userRepo;

            public FileController (IGenericRepository<User> userRepo) {
                _userRepo = userRepo;
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
                    using (PdfReader reader = new PdfReader (file.Name)) {
                        StringBuilder text = new StringBuilder ();

                        for (int i = 1; i <= reader.NumberOfPages; i++) {
                            text.Append (PdfTextExtractor.GetTextFromPage (reader, i));
                        }

                        string yup = text.ToString ();
                    }
                }

                return Ok();
            }
        }
}