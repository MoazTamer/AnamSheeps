using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddWithdrawalsAndBalances : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblDailyMovementBalances",
                columns: table => new
                {
                    DailyMovementBalance_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementBalance_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementBalance_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovementBalance_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementBalance_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementBalance_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementBalance_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementBalance_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementBalances", x => x.DailyMovementBalance_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementBalances_TblDailyMovements_DailyMovementBalance_MovementID",
                        column: x => x.DailyMovementBalance_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TblDailyMovementWithdrawals",
                columns: table => new
                {
                    DailyMovementWithdrawal_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementWithdrawal_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementWithdrawal_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovementWithdrawal_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementWithdrawal_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWithdrawal_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWithdrawal_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWithdrawal_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementWithdrawals", x => x.DailyMovementWithdrawal_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementWithdrawals_TblDailyMovements_DailyMovementWithdrawal_MovementID",
                        column: x => x.DailyMovementWithdrawal_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementBalances_DailyMovementBalance_MovementID",
                table: "TblDailyMovementBalances",
                column: "DailyMovementBalance_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementWithdrawals_DailyMovementWithdrawal_MovementID",
                table: "TblDailyMovementWithdrawals",
                column: "DailyMovementWithdrawal_MovementID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementBalances");

            migrationBuilder.DropTable(
                name: "TblDailyMovementWithdrawals");
        }
    }
}
