using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesRepository.Migrations
{
    /// <inheritdoc />
    public partial class testLoacl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovementCustomers_TblCustomer_DailyMovementCustomer_CustomerID",
                table: "TblDailyMovementCustomers");

            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovementCustomers_TblDailyMovements_DailyMovementCustomer_MovementID",
                table: "TblDailyMovementCustomers");

            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovementExpenses_TblExpense_Item_DailyMovementExpense_CategoryID",
                table: "TblDailyMovementExpenses");

            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovementSuppliers_TblSupplier_DailyMovementSupplier_SupplierID",
                table: "TblDailyMovementSuppliers");

            migrationBuilder.DropIndex(
                name: "IX_TblDailyMovementCustomers_DailyMovementCustomer_CustomerID",
                table: "TblDailyMovementCustomers");

            migrationBuilder.AlterColumn<int>(
                name: "DailyMovementSupplier_SupplierID",
                table: "TblDailyMovementSuppliers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "DailyMovementSupplier_SupplierName",
                table: "TblDailyMovementSuppliers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DailyMovementExpense_CategoryID",
                table: "TblDailyMovementExpenses",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "DailyMovementExpense_CategoryName",
                table: "TblDailyMovementExpenses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DailyMovementCustomer_MovementID",
                table: "TblDailyMovementCustomers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "DailyMovementCustomer_CustomerName",
                table: "TblDailyMovementCustomers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovementCustomers_TblDailyMovements_DailyMovementCustomer_MovementID",
                table: "TblDailyMovementCustomers",
                column: "DailyMovementCustomer_MovementID",
                principalTable: "TblDailyMovements",
                principalColumn: "DailyMovement_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovementExpenses_TblExpense_Item_DailyMovementExpense_CategoryID",
                table: "TblDailyMovementExpenses",
                column: "DailyMovementExpense_CategoryID",
                principalTable: "TblExpense_Item",
                principalColumn: "ExpenseItem_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovementSuppliers_TblSupplier_DailyMovementSupplier_SupplierID",
                table: "TblDailyMovementSuppliers",
                column: "DailyMovementSupplier_SupplierID",
                principalTable: "TblSupplier",
                principalColumn: "Supplier_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovementCustomers_TblDailyMovements_DailyMovementCustomer_MovementID",
                table: "TblDailyMovementCustomers");

            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovementExpenses_TblExpense_Item_DailyMovementExpense_CategoryID",
                table: "TblDailyMovementExpenses");

            migrationBuilder.DropForeignKey(
                name: "FK_TblDailyMovementSuppliers_TblSupplier_DailyMovementSupplier_SupplierID",
                table: "TblDailyMovementSuppliers");

            migrationBuilder.DropColumn(
                name: "DailyMovementSupplier_SupplierName",
                table: "TblDailyMovementSuppliers");

            migrationBuilder.DropColumn(
                name: "DailyMovementExpense_CategoryName",
                table: "TblDailyMovementExpenses");

            migrationBuilder.DropColumn(
                name: "DailyMovementCustomer_CustomerName",
                table: "TblDailyMovementCustomers");

            migrationBuilder.AlterColumn<int>(
                name: "DailyMovementSupplier_SupplierID",
                table: "TblDailyMovementSuppliers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DailyMovementExpense_CategoryID",
                table: "TblDailyMovementExpenses",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DailyMovementCustomer_MovementID",
                table: "TblDailyMovementCustomers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TblDailyMovementCustomers_DailyMovementCustomer_CustomerID",
                table: "TblDailyMovementCustomers",
                column: "DailyMovementCustomer_CustomerID");

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovementCustomers_TblCustomer_DailyMovementCustomer_CustomerID",
                table: "TblDailyMovementCustomers",
                column: "DailyMovementCustomer_CustomerID",
                principalTable: "TblCustomer",
                principalColumn: "Customer_ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovementCustomers_TblDailyMovements_DailyMovementCustomer_MovementID",
                table: "TblDailyMovementCustomers",
                column: "DailyMovementCustomer_MovementID",
                principalTable: "TblDailyMovements",
                principalColumn: "DailyMovement_ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovementExpenses_TblExpense_Item_DailyMovementExpense_CategoryID",
                table: "TblDailyMovementExpenses",
                column: "DailyMovementExpense_CategoryID",
                principalTable: "TblExpense_Item",
                principalColumn: "ExpenseItem_ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TblDailyMovementSuppliers_TblSupplier_DailyMovementSupplier_SupplierID",
                table: "TblDailyMovementSuppliers",
                column: "DailyMovementSupplier_SupplierID",
                principalTable: "TblSupplier",
                principalColumn: "Supplier_ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
