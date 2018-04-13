﻿// <auto-generated />
using LodgeNET.API.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace LodgeNET.API.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20180409215411_init")]
    partial class init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.2-rtm-10011")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("LodgeNET.API.Models.AccountType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.ToTable("AccountTypes");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Building", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BuildingCategoryId");

                    b.Property<string>("Name");

                    b.Property<int>("Number");

                    b.HasKey("Id");

                    b.HasIndex("BuildingCategoryId");

                    b.ToTable("Buildings");
                });

            modelBuilder.Entity("LodgeNET.API.Models.BuildingCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.ToTable("BuildingCategories");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Guest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Chalk");

                    b.Property<string>("CommPhone");

                    b.Property<int>("DodId");

                    b.Property<string>("DsnPhone");

                    b.Property<string>("Email");

                    b.Property<string>("FirstName");

                    b.Property<string>("Gender");

                    b.Property<string>("LastName");

                    b.Property<string>("MiddleInitial")
                        .HasMaxLength(1);

                    b.Property<int?>("RankId");

                    b.Property<int>("UnitId");

                    b.HasKey("Id");

                    b.HasIndex("RankId");

                    b.HasIndex("UnitId");

                    b.ToTable("Guests");
                });

            modelBuilder.Entity("LodgeNET.API.Models.GuestReservation", b =>
                {
                    b.Property<int>("GuestId");

                    b.Property<int>("ReservationId");

                    b.HasKey("GuestId", "ReservationId");

                    b.HasIndex("ReservationId");

                    b.ToTable("GuestReservation");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Rank", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Grade");

                    b.Property<string>("RankName");

                    b.Property<int>("ServiceId");

                    b.Property<string>("Tier");

                    b.HasKey("Id");

                    b.HasIndex("ServiceId");

                    b.ToTable("Ranks");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Reservation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Canceled");

                    b.Property<DateTime>("CheckInDate");

                    b.Property<DateTime>("CheckOutDate");

                    b.Property<DateTime>("DateCreated");

                    b.HasKey("Id");

                    b.ToTable("Reservations");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Room", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BuildingId");

                    b.Property<int>("Capacity");

                    b.Property<int>("Floor");

                    b.Property<int>("RoomNumber");

                    b.Property<int>("SquareFootage");

                    b.Property<int>("SurgeMultiplier");

                    b.HasKey("Id");

                    b.HasIndex("BuildingId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Service", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ServiceName");

                    b.HasKey("Id");

                    b.ToTable("Services");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Stay", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BuildingId");

                    b.Property<DateTime>("DateCheckedIn");

                    b.Property<int>("GuestId");

                    b.Property<int>("ReservationId");

                    b.Property<int?>("RoomId");

                    b.Property<DateTime>("dateCheckedOut");

                    b.HasKey("Id");

                    b.HasIndex("BuildingId");

                    b.HasIndex("GuestId");

                    b.HasIndex("ReservationId");

                    b.HasIndex("RoomId");

                    b.ToTable("Stays");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Unit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.Property<int?>("ParentUnitId");

                    b.HasKey("Id");

                    b.HasIndex("ParentUnitId");

                    b.ToTable("Units");
                });

            modelBuilder.Entity("LodgeNET.API.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccountTypeId");

                    b.Property<bool>("Approved");

                    b.Property<string>("CommPhone");

                    b.Property<int?>("DodId");

                    b.Property<string>("DsnPhone");

                    b.Property<string>("Email");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<string>("MiddleInitial")
                        .HasMaxLength(1);

                    b.Property<byte[]>("PasswordHash");

                    b.Property<byte[]>("PasswordSalt");

                    b.Property<int?>("RankId");

                    b.Property<int?>("UnitId");

                    b.Property<string>("UserName");

                    b.HasKey("Id");

                    b.HasIndex("AccountTypeId");

                    b.HasIndex("RankId");

                    b.HasIndex("UnitId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Building", b =>
                {
                    b.HasOne("LodgeNET.API.Models.BuildingCategory", "BuildingCategory")
                        .WithMany()
                        .HasForeignKey("BuildingCategoryId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("LodgeNET.API.Models.Guest", b =>
                {
                    b.HasOne("LodgeNET.API.Models.Rank", "Rank")
                        .WithMany()
                        .HasForeignKey("RankId");

                    b.HasOne("LodgeNET.API.Models.Unit", "Unit")
                        .WithMany()
                        .HasForeignKey("UnitId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("LodgeNET.API.Models.GuestReservation", b =>
                {
                    b.HasOne("LodgeNET.API.Models.Guest", "Guest")
                        .WithMany("GuestReservations")
                        .HasForeignKey("GuestId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("LodgeNET.API.Models.Reservation", "Reservation")
                        .WithMany("GuestReservations")
                        .HasForeignKey("ReservationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("LodgeNET.API.Models.Rank", b =>
                {
                    b.HasOne("LodgeNET.API.Models.Service", "Service")
                        .WithMany("Ranks")
                        .HasForeignKey("ServiceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("LodgeNET.API.Models.Room", b =>
                {
                    b.HasOne("LodgeNET.API.Models.Building", "Building")
                        .WithMany()
                        .HasForeignKey("BuildingId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("LodgeNET.API.Models.Stay", b =>
                {
                    b.HasOne("LodgeNET.API.Models.Building", "Building")
                        .WithMany()
                        .HasForeignKey("BuildingId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("LodgeNET.API.Models.Guest", "Guest")
                        .WithMany()
                        .HasForeignKey("GuestId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("LodgeNET.API.Models.Reservation", "Reservation")
                        .WithMany()
                        .HasForeignKey("ReservationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("LodgeNET.API.Models.Room", "Room")
                        .WithMany()
                        .HasForeignKey("RoomId");
                });

            modelBuilder.Entity("LodgeNET.API.Models.Unit", b =>
                {
                    b.HasOne("LodgeNET.API.Models.Unit", "ParentUnit")
                        .WithMany()
                        .HasForeignKey("ParentUnitId");
                });

            modelBuilder.Entity("LodgeNET.API.Models.User", b =>
                {
                    b.HasOne("LodgeNET.API.Models.AccountType", "AccountType")
                        .WithMany()
                        .HasForeignKey("AccountTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("LodgeNET.API.Models.Rank", "Rank")
                        .WithMany()
                        .HasForeignKey("RankId");

                    b.HasOne("LodgeNET.API.Models.Unit", "Unit")
                        .WithMany()
                        .HasForeignKey("UnitId");
                });
#pragma warning restore 612, 618
        }
    }
}
