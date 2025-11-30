using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class updateDailyMovementdetailsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DailyMovementDetails_DeleteDate",
                table: "TblDailyMovementDetails",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DailyMovementDetails_DeleteUserID",
                table: "TblDailyMovementDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DailyMovementDetails_Visible",
                table: "TblDailyMovementDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DailyMovementDetails_DeleteDate",
                table: "TblDailyMovementDetails");

            migrationBuilder.DropColumn(
                name: "DailyMovementDetails_DeleteUserID",
                table: "TblDailyMovementDetails");

            migrationBuilder.DropColumn(
                name: "DailyMovementDetails_Visible",
                table: "TblDailyMovementDetails");
        }
    }
}
