using Microsoft.EntityFrameworkCore.Storage;
using SalesModel.Models;

namespace SalesModel.IRepository
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<ApplicationUser> ApplicationUser { get; }
		IRepository<ApplicationRole> ApplicationRole { get; }
        IRepository<TblBranch> Branch { get; }
		IRepository<TblVat> Vat { get; }
        
		IRepository<TblProduct_Category> Product_Category { get; }
        IRepository<TblCustomer> Customer { get; }
        IRepository<TblSupplier> Supplier { get; }
        IRepository<TblProduct> Product { get; }
        IRepository<TblExpense_Item> Expense_Item { get; }

        // Daily Movement Repositories
        IRepository<TblDailyMovement> DailyMovement { get; }
        IRepository<TblDailyMovementDetails> DailyMovementDetails { get; }
        IRepository<TblDailyMovementSales> DailyMovementSales { get; }
        IRepository<TblDailyMovementExpenses> DailyMovementExpenses { get; }
        IRepository<TblDailyMovementSuppliers> DailyMovementSuppliers { get; }
        IRepository<TblDailyMovementCustomers> DailyMovementCustomers { get; }
        //IRepository<oldTblDailyMovementWithdrawals> DailyMovementWithdrawals { get; }
        IRepository<TblDailyMovementTaslim> DailyMovementTaslim { get; }
        IRepository<TblDailyMovementWarid> DailyMovementWarid { get; }
        IRepository<TblDailyMovementBalances> DailyMovementBalances { get; }
        // Warehouse Repositories
        IRepository<TblWarehouseMovement> WarehouseMovement { get; }
        IRepository<TblWarehouseMortality> WarehouseMortality { get; }
        IRepository<TblWarehouseLivestock> WarehouseLivestock { get; }
        IRepository<TblWarehouseOutgoing> WarehouseOutgoing { get; }



        ISP_Call SP_Call { get; }

        Task<int> Complete();

        Task<IDbContextTransaction> BeginTransactionAsync();

        Task CommitTransactionAsync();

        Task RollbackTransactionAsync();

    }
}
