using System.Collections.Generic;
using AutoMapper;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;

namespace LodgeNET.API.ConfigHelpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<UserForRegisterDto, User>();
            CreateMap<Building, BuildingDataDto>();
            CreateMap<BuildingCategory, BuildingCategoryDataDto>();
            CreateMap<Room, RoomForDisplayDto>();
        }
    }
}