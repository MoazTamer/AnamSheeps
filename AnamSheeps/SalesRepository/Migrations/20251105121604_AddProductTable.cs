using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class AddProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TblProduct",
                columns: table => new
                {
                    Product_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Product_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Product_Code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Product_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Product_CategoryID = table.Column<int>(type: "int", nullable: true),
                    Product_Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Product_Visible = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Product_AddUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Product_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Product_EditUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Product_EditDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Product_DeleteUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Product_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblProduct", x => x.Product_ID);
                    table.ForeignKey(
                        name: "FK_TblProduct_TblProduct_Category_Product_CategoryID",
                        column: x => x.Product_CategoryID,
                        principalTable: "TblProduct_Category",
                        principalColumn: "ProductCategory_ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblProduct_Product_CategoryID",
                table: "TblProduct",
                column: "Product_CategoryID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TblProduct");
        }
    }
}
