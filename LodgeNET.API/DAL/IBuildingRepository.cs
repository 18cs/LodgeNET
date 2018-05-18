using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL {
    public interface IBuildingRepository: IGenericRepository<Building>
    {
        Task<PagedList<BuildingCategory>> GetBuildingTypesPagination (
            PagUserParams userParams,
            Expression<Func<BuildingCategory, object>>[] includeProperties = null,
            Expression<Func<BuildingCategory, bool>> filter = null
        );
    }
}