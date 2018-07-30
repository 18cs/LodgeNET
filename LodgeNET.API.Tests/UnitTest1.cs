using LodgeNET.API.BLL;
using LodgeNET.API.DAL;
using LodgeNET.API.DAL.Dtos;
using LodgeNET.API.DAL.Models;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class Tests
    {
        // TODO, Reference Moq and NUnit for dependency injection
        AuthService _authService;
        UserForLoginDto _userForLoginDto;
        User _userFromRepo;

        [SetUp]
        public void Setup()
        {
            // IAuthRepository authRepo,
            //                 IConfiguration config,
            //                 IGenericRepository<Unit> unitRepo,
            //                 IGenericRepository<Service> serviceRepo,
            //                 IGenericRepository<AccountType> accountTypeRepo,
            //                 IGenericRepository<Rank> rankRepo,
            //                 IMapper mapper
            // _authService = new AuthService(new AuthRepository(), new UnitRepository(), );
            _userForLoginDto = new UserForLoginDto();
            _userFromRepo = new User();
        }

        [TestCase ("default", "password")]
        public void Login_ExpectedValues_ReturnsUserOrException()
        {
            
            Assert.Pass();
        }
    }
}