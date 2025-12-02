using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddDelegatesAndWarehouseKeepers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DailyMovement_DelegateID",
                table: "TblDailyMovements",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TblDelegate",
                columns: table => new
                {
                    Delegate_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Delegate_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Delegate_Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_AddUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Delegate_EditUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Delegate_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDelegate", x => x.Delegate_ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovements_DailyMovement_DelegateID",
                table: "TblDailyMovements",
                column: "DailyMovement_DelegateID");

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovements_TblDelegate_DailyMovement_DelegateID",
                table: "TblDailyMovements",
                column: "DailyMovement_DelegateID",
                principalTable: "TblDelegate",
                principalColumn: "Delegate_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovements_TblDelegate_DailyMovement_DelegateID",
                table: "TblDailyMovements");

            migrationBuilder.DropTable(
                name: "TblDelegate");

            migrationBuilder.DropIndex(
                name: "IX_TblDailyMovements_DailyMovement_DelegateID",
                table: "TblDailyMovements");

            migrationBuilder.DropColumn(
                name: "DailyMovement_DelegateID",
                table: "TblDailyMovements");
        }
    }
}
