using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.BLL
{
    public class UnitService
    {
        private IMapper _mapper { get; set; }
        private readonly IUnitRepository _unitRepo;
        public UnitService(IUnitRepository unitRepo,
                            IMapper mapper)
        {
            _unitRepo = unitRepo;
            _mapper = mapper;
        }
        public async Task<PagedList<Unit>> GetUnitsPagination(UnitUserParams userParams)
        {
            var units = await _unitRepo.GetUnitPagination(userParams);

            return (units);
        }

        public async Task<IEnumerable<Unit>> GetUnits() {
            var units = await _unitRepo.GetAsync();

            return (units);
        }

        public async Task<Unit> GetUnit(int id)
        {
            var unit = await _unitRepo.GetByID(id);

            return (unit);
        }
        
        public async Task<Unit> Update(Unit updateUnit) {
            var unit = await _unitRepo.GetFirstOrDefault(u => u.Id == updateUnit.Id);

            if (unit == null) {
                throw new System.ArgumentException ("Unable to update unit", string.Empty);
            }

            unit.Name = updateUnit.Name;
            unit.ParentUnitId = updateUnit.ParentUnitId;
            await _unitRepo.SaveAsync();

            return (unit);
        }

        public async Task<int> DeleteUnitById (int id) {
            var unit = await _unitRepo.GetFirstOrDefault (u => u.Id == id);

            if (unit == null) {
                throw new System.ArgumentException ("Unable to delete unit", string.Empty);
            }

            await _unitRepo.Delete (unit);
            await _unitRepo.SaveAsync ();

            return (id);
        }
        
    }
}