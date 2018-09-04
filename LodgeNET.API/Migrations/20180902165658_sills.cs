using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace LodgeNET.API.Migrations
{
    public partial class sills : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Uploads_Users_UserId",
                table: "Uploads");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Uploads",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InSurge",
                table: "BuildingCategories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Uploads_Users_UserId",
                table: "Uploads",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Uploads_Users_UserId",
                table: "Uploads");

            migrationBuilder.DropColumn(
                name: "InSurge",
                table: "BuildingCategories");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Uploads",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Uploads_Users_UserId",
                table: "Uploads",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
