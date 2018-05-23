using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public interface IUnitRepository : IGenericRepository<Unit>
    {
          Task<PagedList<Unit>> GetUnitPagination(
            UnitUserParams userParams, 
            Expression<Func<Unit, object>>[] includeProperties = null,
            Expression<Func<Unit, bool>> filter = null
        );

        Unit GetFirst (
            Func<Unit, bool> filter, 
            Expression<Func<Unit, object>>[] includeProperties = null);
    }
}