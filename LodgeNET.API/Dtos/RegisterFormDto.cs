using System.Collections.Generic;
using LodgeNET.API.Models;

namespace LodgeNET.API.Dtos
{
    public class RegisterFormDto
    {
        public IEnumerable<Service> ServiceList { get; set; }
        public IEnumerable<AccountType> AccountTypeList { get; set; }
        public IEnumerable<Unit> UnitList { get; set; }
    }
}