using LodgeNET.API.DAL;
using LodgeNET.API.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System;
using Microsoft.EntityFrameworkCore;
using LodgeNET.API.Helpers;

namespace LodgeNET.API.DAL
{
    public class BuildingRepository : GenericRepository<Building>, IBuildingRepository
    {
        // private readonly DataContext _context;
        public BuildingRepository(DataContext context)
            :base(context)
        {
            
        }

        public async Task<PagedList<BuildingCategory>> GetBuildingTypesPagination(
            PagUserParams userParams, 
            Expression<Func<BuildingCategory, object>>[] includeProperties = null,
            Expression<Func<BuildingCategory, bool>> filter = null
        ) {
            var buildingCategories = _context.BuildingCategories.AsQueryable();

            if (includeProperties != null) {
                foreach (Expression<Func<BuildingCategory, object>> includeProperty in includeProperties) {
                    buildingCategories = buildingCategories.Include<BuildingCategory, object> (includeProperty);
                }
            }

            if(filter != null)
            {
                buildingCategories = buildingCategories.Where(filter);
            }

            return await PagedList<BuildingCategory>.CreateAsync(buildingCategories, userParams.PageNumber, userParams.PageSize);
        }


    }
}