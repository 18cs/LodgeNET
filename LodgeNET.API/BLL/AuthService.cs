using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.BLL
{
    public class AuthService
    {
        private readonly IAuthRepository _authRepo;
        private readonly IGenericRepository<Unit> _unitRepo;
        private readonly IGenericRepository<Service> _serviceRepo;
        private readonly IGenericRepository<AccountType> _accountTypeRepo;
        private readonly IGenericRepository<Rank> _rankRepo;
        private readonly IConfiguration _config;
        private IMapper _mapper { get; set; }
        public AuthService(IAuthRepository authRepo,
                            IConfiguration config,
                            IGenericRepository<Unit> unitRepo,
                            IGenericRepository<Service> serviceRepo,
                            IGenericRepository<AccountType> accountTypeRepo,
                            IGenericRepository<Rank> rankRepo,
                            IMapper mapper)
        {
            _config = config;
            _authRepo = authRepo;
            _unitRepo = unitRepo;
            _serviceRepo = serviceRepo;
            _accountTypeRepo = accountTypeRepo;
            _rankRepo = rankRepo;
            _mapper = mapper;
        }

        public async Task<User> Register([FromBody]UserForRegisterDto userForRegisterDto)
        {
            if(!string.IsNullOrEmpty(userForRegisterDto.UserName))
                userForRegisterDto.UserName = userForRegisterDto.UserName.ToUpper();
            
            if (await _authRepo.UserExists(userForRegisterDto.UserName))
                throw new System.ArgumentException("Username already exists", "Username");

            if ((await _authRepo.GetFirstOrDefault(u => u.DodId == userForRegisterDto.DodId)) != null)
                throw new System.ArgumentException("DodId already used for an account", "DodId");

            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            var createUser = await _authRepo.Register(userToCreate, userForRegisterDto.Password);

            return (createUser);

        }

    }
}