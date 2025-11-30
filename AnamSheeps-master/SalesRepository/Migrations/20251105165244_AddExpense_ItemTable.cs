using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddExpense_ItemTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblExpense_Item",
                columns: table => new
                {
                    ExpenseItem_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExpenseItem_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpenseItem_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpenseItem_AddUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpenseItem_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpenseItem_EditUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpenseItem_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpenseItem_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpenseItem_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblExpense_Item", x => x.ExpenseItem_ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblExpense_Item");
        }
    }
}
