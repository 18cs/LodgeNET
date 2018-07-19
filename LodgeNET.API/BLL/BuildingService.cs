using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
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

    }
}