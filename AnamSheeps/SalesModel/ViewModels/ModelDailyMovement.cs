using SalesModel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.ViewModels
{
    public class ModelDailyMovement
    {
        public int DailyMovement_ID { get; set; }
        public DateTime DailyMovement_Date { get; set; }
        public string userName { get; set; }
        public string DailyMovement_UserID { get; set; }
        public decimal DailyMovement_FinalBalance { get; set; }
        public List<ModelDailyMovementDetails> Details { get; set; } = new List<ModelDailyMovementDetails>();
        public List<ModelDailyMovementSales> Sales { get; set; } = new List<ModelDailyMovementSales>();
        public List<ModelDailyMovementExpenses> Expenses { get; set; } = new List<ModelDailyMovementExpenses>();
        public List<ModelDailyMovementSuppliers> Suppliers { get; set; } = new List<ModelDailyMovementSuppliers>();
        public List<ModelDailyMovementCustomers> Customers { get; set; } = new List<ModelDailyMovementCustomers>();
        public List<ModelDailyMovementTaslim> Taslim { get; set; } = new List<ModelDailyMovementTaslim>();
        public List<ModelDailyMovementWarid> Warid { get; set; } = new List<ModelDailyMovementWarid>();

        public List<ModelDailyMovementBalances> Balances { get; set; }
        public DateTime? DailyMovement_AddDate { get; set; }
        public DateTime? DailyMovement_EditDate { get; set; }


        public List<ModelWarehouseMovement>? WarehouseMovement { get; set; }
        public List<ModelWarehouseMortality> Mortality { get; set; }
    }

    public class ModelDailyMovementDetails
    {
        public int DailyMovementDetails_ID { get; set; }
        public int DailyMovementDetails_ProductID { get; set; }
        public string Product_Name { get; set; }
        public int DailyMovementDetails_Quantity { get; set; }
        public decimal DailyMovementDetails_Price { get; set; }
        public decimal DailyMovementDetails_Total { get; set; }
        public string DailyMovementDetails_PaymentType { get; set; }
        public string? DailyMovementDetails_Notes { get; set; }
        public int DailyMovementDetails_MovementID { get; set; }
    }
    public class ModelDailyMovementSales
    {
        public int DailyMovementSales_ID { get; set; }
        public int DailyMovementSales_ProductID { get; set; }
        public string Product_Name { get; set; }
        public int DailyMovementSales_Quantity { get; set; }
        public decimal DailyMovementSales_Price { get; set; }
        public decimal DailyMovementSales_Total { get; set; }
        public string DailyMovementSales_PaymentType { get; set; }
        public string? DailyMovementSales_Notes { get; set; }
        public int DailyMovementSales_MovementID { get; set; }
    }
    public class ModelDailyMovementExpenses
    {
        public int DailyMovementExpense_ID { get; set; }
        public int? DailyMovementExpense_CategoryID { get; set; }
        public string? DailyMovementExpense_CategoryName { get; set; }
        //public string? ExpenseCategory_Name {  get; set; }
        public int DailyMovementExpense_Quantity { get; set; }
        public decimal DailyMovementExpense_Amount { get; set; }
        public decimal DailyMovementExpense_Total { get; set; }
        public string? DailyMovementExpense_Notes { get; set; }
        public int DailyMovementExpense_MovementID { get; set; }
    }

    public class ModelDailyMovementSuppliers
    {
        public int DailyMovementSupplier_ID { get; set; }
        public int? DailyMovementSupplier_SupplierID { get; set; }
        public string? DailyMovementSupplier_SupplierName {get; set;}
        public string? Supplier_Name { get; set; }
        //public string DailyMovementSupplier_SupplierName { get; set; }
        public decimal DailyMovementSupplier_Amount { get; set; }
        public string? DailyMovementSupplier_PaymentType { get; set; }
        public string? DailyMovementSupplier_Notes { get; set; }
        public int DailyMovementSupplier_MovementID { get; set; }
    }

    public class ModelDailyMovementCustomers
    {
        public int DailyMovementCustomer_ID { get; set; }
        public int? DailyMovementCustomer_CustomerID { get; set; }
        public string? DailyMovementCustomer_CustomerName { get; set; }
        public string? Customer_Name { get; set; }
        public decimal DailyMovementCustomer_Amount { get; set; }
        public string? DailyMovementCustomer_PaymentType { get; set; }
        public string? DailyMovementCustomer_Notes { get; set; }
        public int DailyMovementCustomer_MovementID { get; set; }
    }

    public class ModelDailyMovementTaslim
    {
        public int DailyMovementTaslim_ID { get; set; }
        public int DailyMovementTaslim_MovementID { get; set; }
        public string DailyMovementTaslim_Receiver { get; set; }
        public decimal DailyMovementTaslim_Amount { get; set; }
        public string? DailyMovementTaslim_Notes { get; set; }
    }

    public class ModelDailyMovementWarid
    {
        public int DailyMovementWarid_ID { get; set; }
        public int DailyMovementWarid_MovementID { get; set; }
        public string DailyMovementWarid_Receiver { get; set; }
        public decimal DailyMovementWarid_Amount { get; set; }
        public string? DailyMovementWarid_Notes { get; set; }
    }

    public class ModelDailyMovementBalances
    {
        public int DailyMovementBalance_ID { get; set; }
        public string DailyMovementBalance_Type { get; set; }
        public decimal DailyMovementBalance_Amount { get; set; }
        public string? DailyMovementBalance_Notes { get; set; }
        public int DailyMovementBalance_MovementID { get; set; }
    }


    public class ModelDailyAndWarehoussMovement
    {
        public int DailyMovement_ID { get; set; }
        public DateTime DailyMovement_Date { get; set; }
        public string userName { get; set; }
        public string DailyMovement_UserID { get; set; }
        public decimal DailyMovement_FinalBalance { get; set; }
        public List<ModelDailyMovementDetails> Details { get; set; } = new List<ModelDailyMovementDetails>();
        public List<ModelDailyMovementSales> Sales { get; set; } = new List<ModelDailyMovementSales>();
        public List<ModelDailyMovementExpenses> Expenses { get; set; } = new List<ModelDailyMovementExpenses>();
        public List<ModelDailyMovementSuppliers> Suppliers { get; set; } = new List<ModelDailyMovementSuppliers>();
        public List<ModelDailyMovementCustomers> Customers { get; set; } = new List<ModelDailyMovementCustomers>();
        public List<ModelDailyMovementTaslim> Taslim { get; set; } = new List<ModelDailyMovementTaslim>();
        public List<ModelDailyMovementWarid> Warid { get; set; } = new List<ModelDailyMovementWarid>();

        public List<ModelDailyMovementBalances> Balances { get; set; }


        public List<ModelWarehouseMortality> Mortalities { get; set; } = new List<ModelWarehouseMortality>();



    }
}