using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class TableDailyMovementSales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "TblDailyMovementSales",
                columns: table => new
                {
                    DailyMovementSales_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementSales_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementSales_ProductID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementSales_Quantity = table.Column<int>(type: "int", nullable: false),
                    DailyMovementSales_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementSales_Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementSales_PaymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyMovementSales_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementSales_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementSales_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementSales_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementSales", x => x.DailyMovementSales_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementSales_TblDailyMovements_DailyMovementSales_MovementID",
                        column: x => x.DailyMovementSales_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementSales_TblProduct_DailyMovementSales_ProductID",
                        column: x => x.DailyMovementSales_ProductID,
                        principalTable: "TblProduct",
                        principalColumn: "Product_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementSales_DailyMovementSales_MovementID",
                table: "TblDailyMovementSales",
                column: "DailyMovementSales_MovementID");

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementSales_DailyMovementSales_ProductID",
                table: "TblDailyMovementSales",
                column: "DailyMovementSales_ProductID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementSales");

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
                    Delegate_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Delegate_AddUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Delegate_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Delegate_EditUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Delegate_Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Delegate_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
    }
}
