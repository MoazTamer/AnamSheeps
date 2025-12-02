using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SalesModel.Models;

namespace SalesRepository.Data
{
	public class SalesDBContext : IdentityDbContext
	{
		public SalesDBContext(DbContextOptions<SalesDBContext> options)
			: base(options)
		{
		}

		public DbSet<ApplicationUser> ApplicationUser { get; set; }
		public DbSet<ApplicationRole> ApplicationRole { get; set; }
		public DbSet<TblBranch> TblBranch { get; set; }
		public DbSet<TblVat> TblVat { get; set; }

		public DbSet<TblProduct_Category> TblProduct_Category { get; set; }
		public DbSet<TblCustomer> TblCustomer { get; set; }
		public DbSet<TblSupplier> TblSupplier { get; set; }
		public DbSet<TblProduct> TblProduct { get; set; }
		public DbSet<TblExpense_Item> TblExpense_Item { get; set; }

        public DbSet<TblDailyMovement> TblDailyMovements { get; set; }
        public DbSet<TblDailyMovementDetails> TblDailyMovementDetails { get; set; }
		public DbSet<TblDailyMovementSales> TblDailyMovementSales  { get; set; }
        public DbSet<TblDailyMovementExpenses> TblDailyMovementExpenses { get; set; }
		public DbSet<TblDailyMovementSuppliers> TblDailyMovementSuppliers { get; set; }
		public DbSet<TblDailyMovementCustomers> TblDailyMovementCustomers { get; set; }
		public DbSet<TblDailyMovementTaslim> TblDailyMovementTaslim { get; set; }
		public DbSet<TblDailyMovementWarid> TblDailyMovementWarid { get; set; }

        //public DbSet<TblDailyMovementWithdrawals> TblDailyMovementWithdrawals { get; set; }
        public DbSet<TblDailyMovementBalances> TblDailyMovementBalances { get; set; }

        public DbSet<TblWarehouseMovement> TblWarehouseMovement { get; set; }
        public DbSet<TblWarehouseMortality> TblWarehouseMortality { get; set; }
        public DbSet<TblWarehouseLivestock> TblWarehouseLivestock { get; set; }
        public DbSet<TblWarehouseOutgoing> TblWarehouseOutgoing { get; set; }


    }
}
