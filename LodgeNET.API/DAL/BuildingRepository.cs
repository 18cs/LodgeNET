using LodgeNET.API.DAL;
using LodgeNET.API.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL
{
    public class BuildingRepository : GenericRepository<Building>
    {
        // private readonly DataContext _context;
        public BuildingRepository(DataContext context)
            :base(context)
        {
            
        }
    }
}