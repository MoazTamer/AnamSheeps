using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class SplitWithdrawalsIntoTaslimAndWarid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementWithdrawals");

            migrationBuilder.CreateTable(
                name: "TblDailyMovementTaslim",
                columns: table => new
                {
                    DailyMovementTaslim_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementTaslim_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementTaslim_Receiver = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovementTaslim_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementTaslim_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementTaslim_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementTaslim_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyMovementTaslim_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyMovementTaslim_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementTaslim_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementTaslim", x => x.DailyMovementTaslim_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementTaslim_TblDailyMovements_DailyMovementTaslim_MovementID",
                        column: x => x.DailyMovementTaslim_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TblDailyMovementWarid",
                columns: table => new
                {
                    DailyMovementWarid_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementWarid_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementWarid_Receiver = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovementWarid_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementWarid_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWarid_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWarid_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyMovementWarid_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyMovementWarid_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWarid_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementWarid", x => x.DailyMovementWarid_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementWarid_TblDailyMovements_DailyMovementWarid_MovementID",
                        column: x => x.DailyMovementWarid_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementTaslim_DailyMovementTaslim_MovementID",
                table: "TblDailyMovementTaslim",
                column: "DailyMovementTaslim_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementWarid_DailyMovementWarid_MovementID",
                table: "TblDailyMovementWarid",
                column: "DailyMovementWarid_MovementID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementTaslim");

            migrationBuilder.DropTable(
                name: "TblDailyMovementWarid");

            migrationBuilder.CreateTable(
                name: "TblDailyMovementWithdrawals",
                columns: table => new
                {
                    DailyMovementWithdrawal_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementWithdrawal_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementWithdrawal_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementWithdrawal_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyMovementWithdrawal_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWithdrawal_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWithdrawal_Receiver = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementWithdrawal_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovementWithdrawal_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "IX_TblDailyMovementWithdrawals_DailyMovementWithdrawal_MovementID",
                table: "TblDailyMovementWithdrawals",
                column: "DailyMovementWithdrawal_MovementID");
        }
    }
}
