using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Helpers;

namespace LodgeNET.API.DAL {
    public interface IBuildingRepository : IGenericRepository<Building> {
        Task<IEnumerable<Building>> GetBuildings (
            BuildingUserParams userParams,
            Expression<Func<Building, object>>[] includeProperties = null,
            Expression<Func<Building, bool>> filter = null,
            bool includeAllNestedProps = false,
            Func<IQueryable<Building>, IOrderedQueryable<Building>> orderBy = null
        );

        Task<PagedList<BuildingCategory>> GetBuildingTypesPagination (
            PagUserParams userParams,
            Expression<Func<BuildingCategory, object>>[] includeProperties = null,
            Expression<Func<BuildingCategory, bool>> filter = null
        );

        Task<PagedList<Building>> GetBuildingsPagination (
            BuildingUserParams userParams,
            Expression<Func<Building, object>>[] includeProperties = null,
            Expression<Func<Building, bool>> filter = null
        );
    }
}