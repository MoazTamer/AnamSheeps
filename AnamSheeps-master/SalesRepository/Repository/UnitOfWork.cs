using Microsoft.EntityFrameworkCore.Storage;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesRepository.Data;

namespace SalesRepository.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SalesDBContext _db;
        private IDbContextTransaction _currentTransaction;

        public IRepository<ApplicationUser> ApplicationUser { get; private set; }
        public IRepository<ApplicationRole> ApplicationRole { get; private set; }
        public IRepository<TblBranch> Branch { get; private set; }
        public IRepository<TblVat> Vat { get; private set; }
        
        public IRepository<TblProduct_Category> Product_Category { get; private set; }

      



		public ISP_Call SP_Call { get; private set; }

        public IRepository<TblCustomer> Customer { get; private set; }
        public IRepository<TblSupplier> Supplier { get; private set; }
        public IRepository<TblProduct> Product { get; private set; }
        public IRepository<TblExpense_Item> Expense_Item { get; private set; }

        public IRepository<TblDailyMovement> DailyMovement { get; private set; } 

        public IRepository<TblDailyMovementDetails> DailyMovementDetails { get; private set; }
        public IRepository<TblDailyMovementSales> DailyMovementSales { get; private set; }

        public IRepository<TblDailyMovementExpenses> DailyMovementExpenses { get; private set; }

        public IRepository<TblDailyMovementSuppliers> DailyMovementSuppliers { get; private set; }

        public IRepository<TblDailyMovementCustomers> DailyMovementCustomers { get; private set; }
        public IRepository<TblDailyMovementTaslim> DailyMovementTaslim { get; private set; }
        public IRepository<TblDailyMovementWarid> DailyMovementWarid { get; private set; }

        //public IRepository<oldTblDailyMovementWithdrawals> DailyMovementWithdrawals { get; }
        public IRepository<TblDailyMovementBalances> DailyMovementBalances { get; }
        public IRepository<TblWarehouseMovement> WarehouseMovement { get; private set; }
        public IRepository<TblWarehouseMortality> WarehouseMortality { get; private set; }
        public IRepository<TblWarehouseLivestock> WarehouseLivestock { get; private set; }
        public IRepository<TblWarehouseOutgoing> WarehouseOutgoing { get; private set; }



        public UnitOfWork(SalesDBContext db)
        {
            _db = db;

            ApplicationUser = new Repository<ApplicationUser>(_db);
            ApplicationRole = new Repository<ApplicationRole>(_db);
            Branch = new Repository<TblBranch>(_db);
            Vat = new Repository<TblVat>(_db);
            
            Product_Category = new Repository<TblProduct_Category>(_db);
            Customer = new Repository<TblCustomer>(_db);
            Supplier = new Repository<TblSupplier>(_db);
            Product = new Repository<TblProduct>(_db);
            Expense_Item = new Repository<TblExpense_Item>(_db);

            DailyMovement = new Repository<TblDailyMovement>(_db);
            DailyMovementDetails = new Repository<TblDailyMovementDetails>(_db);
            DailyMovementSales = new Repository<TblDailyMovementSales>(_db);
            DailyMovementExpenses = new Repository<TblDailyMovementExpenses>(_db);
            DailyMovementSuppliers = new Repository<TblDailyMovementSuppliers>(_db);
            DailyMovementCustomers = new Repository<TblDailyMovementCustomers>(_db);
            DailyMovementTaslim = new Repository<TblDailyMovementTaslim>(_db);
            DailyMovementWarid = new Repository<TblDailyMovementWarid>(_db);
            //DailyMovementWithdrawals = new Repository<oldTblDailyMovementWithdrawals>(_db);
            DailyMovementBalances = new Repository<TblDailyMovementBalances>(_db);
            WarehouseMovement = new Repository<TblWarehouseMovement>(_db);
            WarehouseMortality = new Repository<TblWarehouseMortality>(_db);
            WarehouseLivestock = new Repository<TblWarehouseLivestock>(_db);
            WarehouseOutgoing = new Repository<TblWarehouseOutgoing>(_db);

            SP_Call = new SP_Call(_db);
        }

        public async Task<int> Complete()
        {
            return await _db.SaveChangesAsync();
        }

        public void Dispose()
        {
            _db.Dispose();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            _currentTransaction = await _db.Database.BeginTransactionAsync();
            return _currentTransaction;
        }

        public async Task CommitTransactionAsync()
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.RollbackAsync();
            }
        }


    }
}
