using SalesModel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.ViewModels
{
    public class DailyMovementSPResult
    {
        public ModelDailyMovement? OneMovement { get; set; }
        public IEnumerable<ModelDailyMovement> Movement { get; set; }
        public IEnumerable<ModelDailyMovementDetails> Details { get; set; }
        public IEnumerable<ModelDailyMovementSales> Sales { get; set; }
        public IEnumerable<ModelDailyMovementExpenses> Expenses { get; set; }
        public IEnumerable<ModelDailyMovementSuppliers> Suppliers { get; set; }
        public IEnumerable<ModelDailyMovementCustomers> Customers { get; set; }
        public IEnumerable<ModelDailyMovementTaslim> Taslim { get; set; }
        public IEnumerable<ModelDailyMovementWarid> Warid { get; set; }
        public IEnumerable<ModelDailyMovementBalances> Balances { get; set; }
        public decimal? PreviousBalance { get; set; }
        public string? UserName { get; set; }

        public List<ModelWarehouseMovement>? WarehouseMovement { get; set; }
        public List<ModelWarehouseMortality> Mortality { get; set; }
    }
    public class DailyMovementListSPResult
    {
        public IEnumerable<ModelUsers> Users { get; set; }
        public IEnumerable<ModelDailyMovement> TodayMovements { get; set; }
        public IEnumerable<ModelDailyMovement> LastMovements { get; set; }
    }


    public class WarehouseMovementSPResult
    {
        public IEnumerable<ModelWarehouseMovement> Movement { get; set; }
        public IEnumerable<TblWarehouseMortality> Mortalities { get; set; }
        public IEnumerable<TblWarehouseLivestock> Livestocks { get; set; }
        public IEnumerable<TblWarehouseOutgoing> Outgoings { get; set; }

        public IEnumerable<TblProduct> Products { get; set; }
        public IEnumerable<TblCustomer> Delegates { get; set; }
    }

}