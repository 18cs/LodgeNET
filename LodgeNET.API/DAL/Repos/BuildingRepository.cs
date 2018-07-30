using LodgeNET.API.DAL;
using LodgeNET.API.DAL.Models;
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

        public async Task<PagedList<Building>> GetBuildingsPagination(
            BuildingUserParams userParams, 
            Expression<Func<Building, object>>[] includeProperties = null,
            Expression<Func<Building, bool>> filter = null
        ) {
            var buildings = _context.Buildings.AsQueryable();

            if (includeProperties != null) {
                foreach (Expression<Func<Building, object>> includeProperty in includeProperties) {
                    buildings = buildings.Include<Building, object> (includeProperty);
                }
            }

            if(filter != null)
            {
                buildings = buildings.Where(filter);
            }

            if (userParams.BuildingCategoryId != null) {
                buildings = buildings.Where(b => b.BuildingCategoryId == userParams.BuildingCategoryId);
            }

            return await PagedList<Building>.CreateAsync(buildings, userParams.PageNumber, userParams.PageSize);
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