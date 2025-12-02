using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class DailyCustomerTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblDailyMovementCustomers",
                columns: table => new
                {
                    DailyMovementCustomer_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementCustomer_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementCustomer_CustomerID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementCustomer_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementCustomer_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementCustomer_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementCustomer_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementCustomer_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementCustomers", x => x.DailyMovementCustomer_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementCustomers_TblCustomer_DailyMovementCustomer_CustomerID",
                        column: x => x.DailyMovementCustomer_CustomerID,
                        principalTable: "TblCustomer",
                        principalColumn: "Customer_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementCustomers_TblDailyMovements_DailyMovementCustomer_MovementID",
                        column: x => x.DailyMovementCustomer_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementCustomers_DailyMovementCustomer_CustomerID",
                table: "TblDailyMovementCustomers",
                column: "DailyMovementCustomer_CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementCustomers_DailyMovementCustomer_MovementID",
                table: "TblDailyMovementCustomers",
                column: "DailyMovementCustomer_MovementID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementCustomers");
        }
    }
}
