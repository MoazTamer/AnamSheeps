using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class SuppliersGrid2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblDailyMovementSuppliers",
                columns: table => new
                {
                    DailyMovementSupplier_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementSupplier_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementSupplier_SupplierID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementSupplier_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementSupplier_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementSupplier_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementSupplier_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementSupplier_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementSuppliers", x => x.DailyMovementSupplier_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementSuppliers_TblDailyMovements_DailyMovementSupplier_MovementID",
                        column: x => x.DailyMovementSupplier_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementSuppliers_TblSupplier_DailyMovementSupplier_SupplierID",
                        column: x => x.DailyMovementSupplier_SupplierID,
                        principalTable: "TblSupplier",
                        principalColumn: "Supplier_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementSuppliers_DailyMovementSupplier_MovementID",
                table: "TblDailyMovementSuppliers",
                column: "DailyMovementSupplier_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementSuppliers_DailyMovementSupplier_SupplierID",
                table: "TblDailyMovementSuppliers",
                column: "DailyMovementSupplier_SupplierID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementSuppliers");
        }
    }
}
