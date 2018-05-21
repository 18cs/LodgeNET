using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL.Repos {
    public class UnitRepository : GenericRepository<Unit>, IUnitRepository {
        public UnitRepository (DataContext context) : base (context) { }

        public async Task<PagedList<Unit>> GetUnitPagination (
            UnitUserParams userParams,
            Expression<Func<Unit, object>>[] includeProperties = null,
            Expression<Func<Unit, bool>> filter = null) {
            var units = _context.Units.AsQueryable ();

            if (includeProperties != null) {
                foreach (Expression<Func<Unit, object>> includeProperty in includeProperties) {
                    units = units.Include<Unit, object> (includeProperty);
                }
            }

            if (filter != null) {
                units = units.Where (filter);
            }

            if (userParams.UnitId != null && userParams.UnitId != 0) {
                units = units.Where (u => u.Id == userParams.UnitId);
            }

            if (userParams.ParentUnitId != null && userParams.ParentUnitId != 0) {
                units = units.Where (u => u.ParentUnitId == userParams.ParentUnitId);
            }

            if (!String.IsNullOrWhiteSpace (userParams.UnitName)) {
                units = units.Where (u => u.Name.Contains (userParams.UnitName));
            }

            if (userParams.IncludeParentUnit) {
                units = units.Include (u => u.ParentUnit);
            }

            return await PagedList<Unit>.CreateAsync (units, userParams.PageNumber, userParams.PageSize);

        }

    }
}