using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddDailyMovementExpensesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblDailyMovementExpenses",
                columns: table => new
                {
                    DailyMovementExpense_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DailyMovementExpense_MovementID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementExpense_CategoryID = table.Column<int>(type: "int", nullable: false),
                    DailyMovementExpense_Quantity = table.Column<int>(type: "int", nullable: false),
                    DailyMovementExpense_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementExpense_Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyMovementExpense_Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementExpense_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementExpense_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DailyMovementExpense_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblDailyMovementExpenses", x => x.DailyMovementExpense_ID);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementExpenses_TblDailyMovements_DailyMovementExpense_MovementID",
                        column: x => x.DailyMovementExpense_MovementID,
                        principalTable: "TblDailyMovements",
                        principalColumn: "DailyMovement_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TblDailyMovementExpenses_TblExpense_Item_DailyMovementExpense_CategoryID",
                        column: x => x.DailyMovementExpense_CategoryID,
                        principalTable: "TblExpense_Item",
                        principalColumn: "ExpenseItem_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementExpenses_DailyMovementExpense_CategoryID",
                table: "TblDailyMovementExpenses",
                column: "DailyMovementExpense_CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementExpenses_DailyMovementExpense_MovementID",
                table: "TblDailyMovementExpenses",
                column: "DailyMovementExpense_MovementID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblDailyMovementExpenses");
        }
    }
}
