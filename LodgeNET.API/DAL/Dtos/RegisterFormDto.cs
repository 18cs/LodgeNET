using System.Collections.Generic;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL.Dtos
{
    public class RegisterFormDto
    {
        public IEnumerable<Service> ServiceList { get; set; }
        public IEnumerable<AccountType> AccountTypeList { get; set; }
        public IEnumerable<Unit> UnitList { get; set; }
    }
}