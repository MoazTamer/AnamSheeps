using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddDailyMovementTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblDailyMovements",
                columns: table => new
                {
                    DailyMovement_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovement_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DailyMovement_UserID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovement_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovement_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyMovement_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovements", x => x.DailyMovement_ID);
                });

            migrationBuilder.CreateTable(
                name: "TblDailyMovementDetails",
                columns: table => new
                {
                    DailyMovementDetails_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementDetails_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementDetails_ProductID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementDetails_Quantity = table.Column<int>(type: "int", nullable: false),
                    DailyMovementDetails_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementDetails_Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementDetails_PaymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovementDetails_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementDetails", x => x.DailyMovementDetails_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementDetails_TblDailyMovements_DailyMovementDetails_MovementID",
                        column: x => x.DailyMovementDetails_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementDetails_TblProduct_DailyMovementDetails_ProductID",
                        column: x => x.DailyMovementDetails_ProductID,
                        principalTable: "TblProduct",
                        principalColumn: "Product_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementDetails_DailyMovementDetails_MovementID",
                table: "TblDailyMovementDetails",
                column: "DailyMovementDetails_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementDetails_DailyMovementDetails_ProductID",
                table: "TblDailyMovementDetails",
                column: "DailyMovementDetails_ProductID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementDetails");

            migrationBuilder.DropTable(
                name: "TblDailyMovements");
        }
    }
}
