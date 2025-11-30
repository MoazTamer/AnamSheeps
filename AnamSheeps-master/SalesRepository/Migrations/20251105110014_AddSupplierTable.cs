using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddSupplierTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblSupplier",
                columns: table => new
                {
                    Supplier_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Supplier_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Supplier_Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Supplier_Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Supplier_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Supplier_AddUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Supplier_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Supplier_EditUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Supplier_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Supplier_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Supplier_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblSupplier", x => x.Supplier_ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblSupplier");
        }
    }
}
