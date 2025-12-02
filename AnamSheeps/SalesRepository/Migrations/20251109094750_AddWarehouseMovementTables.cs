using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddWarehouseMovementTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblWarehouseMovement",
                columns: table => new
                {
                    WarehouseMovement_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseMovement_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WarehouseMovement_UserID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WarehouseMovement_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseMovement_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    WarehouseMovement_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblWarehouseMovement", x => x.WarehouseMovement_ID);
                });

            migrationBuilder.CreateTable(
                name: "TblWarehouseLivestock",
                columns: table => new
                {
                    WarehouseLivestock_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseLivestock_MovementID = table.Column<int>(type: "int", nullable: false),
                    WarehouseLivestock_ProductID = table.Column<int>(type: "int", nullable: false),
                    WarehouseLivestock_Quantity = table.Column<int>(type: "int", nullable: false),
                    WarehouseLivestock_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseLivestock_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseLivestock_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblWarehouseLivestock", x => x.WarehouseLivestock_ID);
                    table.ForeignKey(
                        name: "FK_TblWarehouseLivestock_TblProduct_WarehouseLivestock_ProductID",
                        column: x => x.WarehouseLivestock_ProductID,
                        principalTable: "TblProduct",
                        principalColumn: "Product_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblWarehouseLivestock_TblWarehouseMovement_WarehouseLivestock_MovementID",
                        column: x => x.WarehouseLivestock_MovementID,
                        principalTable: "TblWarehouseMovement",
                        principalColumn: "WarehouseMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TblWarehouseMortality",
                columns: table => new
                {
                    WarehouseMortality_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseMortality_MovementID = table.Column<int>(type: "int", nullable: false),
                    WarehouseMortality_ProductID = table.Column<int>(type: "int", nullable: false),
                    WarehouseMortality_Quantity = table.Column<int>(type: "int", nullable: false),
                    WarehouseMortality_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseMortality_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseMortality_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblWarehouseMortality", x => x.WarehouseMortality_ID);
                    table.ForeignKey(
                        name: "FK_TblWarehouseMortality_TblProduct_WarehouseMortality_ProductID",
                        column: x => x.WarehouseMortality_ProductID,
                        principalTable: "TblProduct",
                        principalColumn: "Product_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblWarehouseMortality_TblWarehouseMovement_WarehouseMortality_MovementID",
                        column: x => x.WarehouseMortality_MovementID,
                        principalTable: "TblWarehouseMovement",
                        principalColumn: "WarehouseMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TblWarehouseOutgoing",
                columns: table => new
                {
                    WarehouseOutgoing_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseOutgoing_MovementID = table.Column<int>(type: "int", nullable: false),
                    WarehouseOutgoing_DelegateName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WarehouseOutgoing_ProductID = table.Column<int>(type: "int", nullable: false),
                    WarehouseOutgoing_Quantity = table.Column<int>(type: "int", nullable: false),
                    WarehouseOutgoing_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseOutgoing_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseOutgoing_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblWarehouseOutgoing", x => x.WarehouseOutgoing_ID);
                    table.ForeignKey(
                        name: "FK_TblWarehouseOutgoing_TblProduct_WarehouseOutgoing_ProductID",
                        column: x => x.WarehouseOutgoing_ProductID,
                        principalTable: "TblProduct",
                        principalColumn: "Product_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblWarehouseOutgoing_TblWarehouseMovement_WarehouseOutgoing_MovementID",
                        column: x => x.WarehouseOutgoing_MovementID,
                        principalTable: "TblWarehouseMovement",
                        principalColumn: "WarehouseMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblWarehouseLivestock_WarehouseLivestock_MovementID",
                table: "TblWarehouseLivestock",
                column: "WarehouseLivestock_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblWarehouseLivestock_WarehouseLivestock_ProductID",
                table: "TblWarehouseLivestock",
                column: "WarehouseLivestock_ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_TblWarehouseMortality_WarehouseMortality_MovementID",
                table: "TblWarehouseMortality",
                column: "WarehouseMortality_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblWarehouseMortality_WarehouseMortality_ProductID",
                table: "TblWarehouseMortality",
                column: "WarehouseMortality_ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_TblWarehouseOutgoing_WarehouseOutgoing_MovementID",
                table: "TblWarehouseOutgoing",
                column: "WarehouseOutgoing_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblWarehouseOutgoing_WarehouseOutgoing_ProductID",
                table: "TblWarehouseOutgoing",
                column: "WarehouseOutgoing_ProductID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblWarehouseLivestock");

            migrationBuilder.DropTable(
                name: "TblWarehouseMortality");

            migrationBuilder.DropTable(
                name: "TblWarehouseOutgoing");

            migrationBuilder.DropTable(
                name: "TblWarehouseMovement");
        }
    }
}
