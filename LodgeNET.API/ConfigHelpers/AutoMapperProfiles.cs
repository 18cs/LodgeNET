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
            CreateMap<UserForRegisterDto, User>()
                .ForMember(user => user.UnitId,
                    opt => opt.MapFrom(dto => dto.UserUnit));
            CreateMap<Building, BuildingDataDto>();
            CreateMap<BuildingCategory, BuildingCategoryDataDto>();
            CreateMap<Room, RoomForCheckinDto>();
            CreateMap<GuestStayForCheckInOutDto, Stay>();
            CreateMap<Stay, GuestStayForCheckInOutDto>()
            .ForMember(guestStayForCheckInOutDto => guestStayForCheckInOutDto.GuestId,
                    opt => opt.MapFrom(stay => stay.Guest.Id));
            CreateMap<Guest, GuestStayForCheckInOutDto>()
                .ForMember(guestStayForCheckInOutDto => guestStayForCheckInOutDto.GuestId,
                    opt => opt.MapFrom(guest => guest.Id));
            CreateMap<GuestStayForCheckInOutDto, Guest>()
                .ForMember(guest => guest.Id,
                    opt => opt.MapFrom(guestStayForCheckin => guestStayForCheckin.GuestId));
            CreateMap<Guest, GuestForCheckinDto>()
                .ForMember(guestStayForRetrieve => guestStayForRetrieve.GuestUnit,
                    opt => opt.MapFrom(guest => guest.Unit))
                .ForMember(guestStayForRetrieve => guestStayForRetrieve.GuestId,
                    opt => opt.MapFrom(guest => guest.Id));
        }
    }
}