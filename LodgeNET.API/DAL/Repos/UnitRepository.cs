using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace LodgeNET.API.DAL.Repos
{
    public class UnitRepository : GenericRepository<Unit>, IUnitRepository
    {
        public UnitRepository(DataContext context) : base(context) { }

        public async Task<IEnumerable<Unit>> GetUnits(
            UnitUserParams userParams,
            Expression<Func<Unit, object>>[] includeProperties = null,
            Expression<Func<Unit, bool>> filter = null
        )
        {
            var units = _context.Units.AsQueryable();
            if (includeProperties != null)
            {
                units = ProcessUnitProperties(units, includeProperties);
            }

            units = ProcessUnitFilter(units, userParams, filter);
            return await units.ToListAsync();
        }

        public async Task<PagedList<Unit>> GetUnitPagination(
            UnitUserParams userParams,
            Expression<Func<Unit, object>>[] includeProperties = null,
            Expression<Func<Unit, bool>> filter = null)
        {
            var units = _context.Units.AsQueryable();

            if (includeProperties != null)
            {
                units = ProcessUnitProperties(units, includeProperties);
            }

            units = ProcessUnitFilter(units, userParams, filter);

            return await PagedList<Unit>.CreateAsync(units, userParams.PageNumber, userParams.PageSize);
        }

        public Unit GetFirst(
            Func<Unit, bool> filter,
            Expression<Func<Unit, object>>[] includeProperties = null)
        {
            var units = _context.Units.AsQueryable();

            if (includeProperties != null)
            {
                units = ProcessUnitProperties(units, includeProperties);
            }

            var unit = units.Where (filter).FirstOrDefault ();

            return unit;
        }

        private IQueryable<Unit> ProcessUnitProperties(IQueryable<Unit> units, Expression<Func<Unit, object>>[] includeProperties)
        {
            foreach (Expression<Func<Unit, object>> includeProperty in includeProperties)
            {
                units = units.Include<Unit, object>(includeProperty);
            }
            return units;
        }

        private IQueryable<Unit> ProcessUnitFilter(IQueryable<Unit> units, UnitUserParams userParams, Expression<Func<Unit, bool>> filter)
        {
            if (filter != null)
            {
                units = units.Where(filter);
            }

            if (userParams.UnitId != null && userParams.UnitId != 0)
            {
                units = units.Where(u => u.Id == userParams.UnitId);
            }

            if (userParams.ParentUnitId != null && userParams.ParentUnitId != 0)
            {
                units = units.Where(u => u.ParentUnitId == userParams.ParentUnitId);
            }

            if (!String.IsNullOrWhiteSpace(userParams.UnitName))
            {
                units = units.Where(u => (u.Name.Contains(userParams.UnitName)||u.UnitAbbreviation.Contains(userParams.UnitName)));
            }

            if (userParams.IncludeParentUnit)
            {
                units = units.Include(u => u.ParentUnit);
            }
            return units;
        }
    }
}