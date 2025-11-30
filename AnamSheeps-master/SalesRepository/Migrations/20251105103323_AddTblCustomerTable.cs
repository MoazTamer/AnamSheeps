using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddTblCustomerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblCustomer",
                columns: table => new
                {
                    Customer_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Customer_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Customer_Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Customer_Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Customer_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Customer_AddUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Customer_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Customer_EditUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Customer_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Customer_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Customer_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblCustomer", x => x.Customer_ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblCustomer");
        }
    }
}
