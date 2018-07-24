using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.BLL {
    public class BuildingService {
        private readonly IBuildingRepository _repo;
        private readonly IGenericRepository<BuildingCategory> _buildingCategoryRepo;
        private readonly IGenericRepository<Stay> _stayRepo;
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IMapper _mapper;
        public BuildingService (IBuildingRepository repo,
            IGenericRepository<BuildingCategory> buildingCategoryRepo,
            IGenericRepository<Stay> stayRepo,
            IGenericRepository<Room> roomRepo,
            IMapper mapper) {
            _mapper = mapper;
            _repo = repo;
            _buildingCategoryRepo = buildingCategoryRepo;
            _stayRepo = stayRepo;
            _roomRepo = roomRepo;
        }

        public async Task<PagedList<Building>> GetBuildingsPagination (BuildingUserParams pageParams) {
            var bldgs = await _repo.GetBuildingsPagination (
                pageParams,
                new Expression<Func<Building, object>>[] {
                    b => b.BuildingCategory
                });

            return (bldgs);
        }

        public async Task<PagedList<BuildingCategory>> GetBuildingTypes (PagUserParams userParams) {
            var buildingTypes = await _repo.GetBuildingTypesPagination (
                userParams
            );

            return (buildingTypes);
        }

        public async Task<IEnumerable<Building>> GetAllBuildings () {

            var buildings = await _repo.GetAsync ();

            return (buildings);
        }

        public async Task<IEnumerable<BuildingCategory>> GetAllBuildingTypes () {

            var buildingTypes = await _buildingCategoryRepo.GetAsync ();

            return (buildingTypes);
        }

        public async Task<Building> GetBuilding (int id) {
            var building = await _repo.GetByID (id);

            return (building);
        }

        public async Task<BuildingsDataDto> buildingDashboardData () {
            var buildingListResult = await _repo.GetAsync ();
            var buildingTypeListResult = await _buildingCategoryRepo.GetAsync ();
            var buildingsDataDto = new BuildingsDataDto () {
                BuildingList = _mapper.Map<IEnumerable<BuildingDataDto>> (buildingListResult),
                BuildingTypeList = _mapper.Map<List<BuildingCategoryDataDto>> (buildingTypeListResult.ToList ())
            };

            foreach (BuildingDataDto b in buildingsDataDto.BuildingList) {
                b.CurrentGuests = await _stayRepo.GetCount (s => s.CheckedOut == false &&
                    s.CheckedIn == true &&
                    !(DateTime.Compare (s.CheckInDate, DateTime.Today) > 0) &&
                    s.BuildingId == b.Id);
                b.Capacity = await _roomRepo.GetSum (r => r.Capacity, r => r.BuildingId == b.Id);

                var bcat = buildingsDataDto.BuildingTypeList.Find (t => t.Id == b.BuildingCategoryId);
                if (bcat != null) {
                    bcat.Capacity += b.Capacity;
                    bcat.CurrentGuests += b.CurrentGuests;
                }
            }
            return (buildingsDataDto);
        }
        public async Task<int> GetCurrentGuests (int id) {
            return await _stayRepo.GetCount (s => s.CheckedOut == false &&
                s.CheckedIn == true &&
                !(DateTime.Compare (s.CheckInDate, DateTime.Today) > 0) &&
                s.BuildingId == id);
        }

        public async Task<int> GetCapacity(int id) {
            return await _roomRepo.GetSum (r => r.Capacity, r => r.BuildingId == id);
        }

        public async Task<Building> SaveBuilding (BuildingDataDto building) {
            var bldg = await _repo.GetFirstOrDefault (b => b.Id == building.Id);

            if (bldg != null) {
                bldg.Name = building.Name;
                bldg.BuildingCategoryId = building.BuildingCategoryId;
            }

            await _repo.SaveAsync ();

            return (bldg);
        }

        public async Task<Building> AddBuilding (Building building) {
            if ((await _repo.GetFirstOrDefault (b => b.Number == building.Number)) != null) {
                throw new System.ArgumentException ("Building Number already exists", string.Empty);
            }

            building.BuildingCategory = null;

            await _repo.Insert (building);

            await _repo.SaveAsync ();

            return (building);
        }

        public async Task<BuildingCategory> SaveBuildingType (BuildingCategoryDataDto buildingType) {
            var bldgType = await _buildingCategoryRepo.GetFirstOrDefault (b => b.Id == buildingType.Id);

            if (bldgType != null) {
                bldgType.Type = buildingType.Type;
            }

            await _buildingCategoryRepo.SaveAsync ();

            return (bldgType);
        }

        public async Task<BuildingCategory> AddBuildingType (BuildingCategory buildingType) {
            var bldgTypeToAdd = _mapper.Map<BuildingCategory> (buildingType);

            await _buildingCategoryRepo.Insert (bldgTypeToAdd);

            await _buildingCategoryRepo.SaveAsync ();

            return (bldgTypeToAdd);
        }

        public async Task<BuildingCategory> DeleteBuildingTypeById (int id) {
            var bldgType = await _buildingCategoryRepo.GetFirstOrDefault (b => b.Id == id);

            await _buildingCategoryRepo.Delete (bldgType.Id);

            await _buildingCategoryRepo.SaveAsync ();

            return (bldgType);
        }
        public async Task<Building> DeleteBuildingById (int id) {
            var bldg = await _repo.GetFirstOrDefault (b => b.Id == id);

            await _repo.Delete (bldg.Id);

            await _repo.SaveAsync ();

            return (bldg);
        }

    }
}