using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

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
                            IGenericRepository<Unit> unitRepo,
                            IGenericRepository<Service> serviceRepo,
                            IGenericRepository<AccountType> accountTypeRepo,
                            IGenericRepository<Rank> rankRepo,
                            IMapper mapper)
        {
            // _config = config;
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
                throw new System.ArgumentException("Username already exists", string.Empty);

            if ((await _authRepo.GetFirstOrDefault(u => u.DodId == userForRegisterDto.DodId)) != null)
                throw new System.ArgumentException("DodId already used for an account", string.Empty);

            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            var createUser = await _authRepo.Register(userToCreate, userForRegisterDto.Password);

            return (createUser);
        }
        public async Task<User> Login([FromBody]UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await _authRepo.Login(userForLoginDto.Username.ToUpper(), userForLoginDto.Password);

            if (userFromRepo == null)
                throw new System.ArgumentException("Username or password was incorrect.", string.Empty);
            
            if (!userFromRepo.Approved)
                throw new System.ArgumentException("Account is pending approval.", string.Empty);

            return (userFromRepo);
        }

        public async Task<IEnumerable<AccountType>> GetAccountTypes() 
        {
            var accountTypes = await _accountTypeRepo.GetAsync();
            return (accountTypes);
        }
    }
}