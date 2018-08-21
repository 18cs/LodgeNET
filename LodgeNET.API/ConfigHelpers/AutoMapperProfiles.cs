using System;
using System.Collections.Generic;
using AutoMapper;
using LodgeNET.API.DAL.Dtos;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Helpers;

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
            CreateMap<Stay, GuestStayForEditDto>();
            CreateMap<GuestStayForCheckInDto, Stay>();
                // .ForMember(guestStayForCheckInOutDto => guestStayForCheckInOutDto.GuestId,
                //         opt => opt.MapFrom(stay => stay.Guest.Id));
            CreateMap<Guest, GuestStayForCheckInDto>()
                .ForMember(guestStayForCheckInOutDto => guestStayForCheckInOutDto.GuestId,
                    opt => opt.MapFrom(guest => guest.Id));
            CreateMap<GuestStayForCheckInDto, Guest>()
                .ForMember(guest => guest.Id,
                    opt => opt.MapFrom(guestStayForCheckin => guestStayForCheckin.GuestId));
            CreateMap<Guest, GuestForCheckinDto>()
                .ForMember(guestStayForRetrieve => guestStayForRetrieve.GuestUnit,
                    opt => opt.MapFrom(guest => guest.Unit))
                .ForMember(guestStayForRetrieve => guestStayForRetrieve.GuestId,
                    opt => opt.MapFrom(guest => guest.Id));
            CreateMap<FileRowForUploadDto, Guest>();
            CreateMap<FileRowForUploadDto, Stay>();
            CreateMap<User, UserForEditDto>()
                .ForMember(userForEditDto => userForEditDto.ServiceId,
                    opt => opt.MapFrom(user => user.Rank.ServiceId));
            CreateMap<UserForEditDto, User>();
            CreateMap<Guest, GuestForEditDto>()
                .ForMember(guestForEditDto => guestForEditDto.ServiceId,
                    opt => opt.MapFrom(guest => guest.Rank.ServiceId));
            CreateMap<GuestForEditDto, Guest>();
            CreateMap<GuestStayForEditDto, Stay>();
            CreateMap<Stay, GuestStayForDisplayDto>()
                .ForMember(exportDto => exportDto.DodId,
                    opt => opt.MapFrom(stay => stay.Guest.DodId))
                .ForMember(exportDto => exportDto.FirstName,
                    opt => opt.MapFrom(stay => stay.Guest.FirstName))
                .ForMember(exportDto => exportDto.MiddleInitial,
                    opt => opt.MapFrom(stay => stay.Guest.MiddleInitial))
                .ForMember(exportDto => exportDto.LastName,
                    opt => opt.MapFrom(stay => stay.Guest.LastName))
                .ForMember(exportDto => exportDto.Gender,
                    opt => opt.MapFrom(stay => stay.Guest.Gender))
                .ForMember(exportDto => exportDto.Email,
                    opt => opt.MapFrom(stay => stay.Guest.Email))
                .ForMember(exportDto => exportDto.CommPhone,
                    opt => opt.MapFrom(stay => stay.Guest.CommPhone))
                .ForMember(exportDto => exportDto.DsnPhone,
                    opt => opt.MapFrom(stay => stay.Guest.DsnPhone))
                .ForMember(exportDto => exportDto.Chalk,
                    opt => opt.MapFrom(stay => stay.Guest.Chalk))
                .ForMember(exportDto => exportDto.Rank,
                    opt => opt.MapFrom(stay => stay.Guest.Rank.RankName))
                .ForMember(exportDto => exportDto.Service,
                    opt => opt.MapFrom(stay => stay.Guest.Rank.Service.ServiceName))
                .ForMember(exportDto => exportDto.Unit,
                    opt => opt.MapFrom(stay => stay.Guest.Unit.Name))
                .ForMember(exportDto => exportDto.RoomNumber,
                    opt => opt.MapFrom(stay => stay.Room.RoomNumber))
                .ForMember(exportDto => exportDto.BuildingName,
                    opt => opt.MapFrom(stay => stay.Building.Number))
                .ForMember(exportDto => exportDto.BuildingName,
                    opt => opt.MapFrom(stay => stay.Building.Name));
            CreateMap<Room, RoomForDisplayDto>()
                .ForMember(exportDTO => exportDTO.BuildingName,
                    opt => opt.MapFrom(room => room.Building.Name))
                .ForMember(exportDTO => exportDTO.BuildingNumber,
                    opt => opt.MapFrom(room => room.Building.Number));
            CreateMap<Building, BuildingForDisplay>()
                .ForMember(exportDto => exportDto.Type,
                    opt => opt.MapFrom(building => building.BuildingCategory.Type));
            CreateMap<BuildingCategory, BuildingTypeForDisplayDto>();
            CreateMap<Guest, GuestForDisplayDto>()
                .ForMember(exportDto => exportDto.Rank,
                    opt => opt.MapFrom(guest => guest.Rank.RankName))
                .ForMember(exportDto => exportDto.UnitName,
                    opt => opt.MapFrom(guest => guest.Unit.Name));
            CreateMap<Unit, UnitForDisplayDto>()
                .ForMember(exportDto => exportDto.ParentUnit,
                    opt => opt.MapFrom(unit => unit.ParentUnit.Name));
            CreateMap<User, UserForDisplayDto>()
                .ForMember(exportDto => exportDto.AccountType,
                    opt => opt.MapFrom(user => user.AccountType.Type))
                    .ForMember(exportDto => exportDto.Unit,
                    opt => opt.MapFrom(user => user.Unit.Name))
                    .ForMember(exportDto => exportDto.Rank,
                    opt => opt.MapFrom(user => user.Rank.RankName));                
        }
    }
}