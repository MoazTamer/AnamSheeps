using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;

namespace Sales.Controllers
{
    [Authorize(Roles = "إدارة")]
    public class ManagementDashboardController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public ManagementDashboardController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        //  متابعة الحركات اليومية للمندوبين
        public async Task<IActionResult> DailyMovementsTracking(DateTime? date)
        {
            var selectedDate = date ?? DateTime.Today;

            var delegates = await _userManager.Users
                .Where(u => u.UserType == "مندوب" && u.Visible == "Yes")
                .OrderBy(u => u.UserName)
                .ToListAsync();

            var trackingList = new List<UserMovementTracking>();

            foreach (var delegateUser in delegates)
            {
                var movement = _unitOfWork.DailyMovement.GetFirstOrDefault(
                    m => m.DailyMovement_UserID == delegateUser.Id &&
                         m.DailyMovement_Date.Date == selectedDate.Date &&
                         m.DailyMovement_Visible == "yes"
                );

                TblDailyMovement lastMovement = movement;
                if (movement == null)
                {
                    lastMovement = _unitOfWork.DailyMovement
                        .GetAll(m =>
                            m.DailyMovement_UserID == delegateUser.Id &&
                            m.DailyMovement_Visible == "yes" &&
                            m.DailyMovement_Date < selectedDate
                        )
                        .OrderByDescending(m => m.DailyMovement_Date)
                        .FirstOrDefault();
                }

                var tracking = new UserMovementTracking
                {
                    UserId = delegateUser.Id,
                    UserName = delegateUser.UserName,
                    UserType = "مندوب",
                    MovementDate = selectedDate,
                    HasMovement = movement != null,
                    MovementId = movement?.DailyMovement_ID ?? 0,
                    LastBalance = lastMovement?.DailyMovement_FinalBalance ?? 0,
                    LastUpdateDate = lastMovement?.DailyMovement_EditDate ?? lastMovement?.DailyMovement_AddDate,
                };

                if (movement != null)
                {
                    var details = _unitOfWork.DailyMovementDetails.GetAll(
                        d => d.DailyMovementDetails_MovementID == movement.DailyMovement_ID &&
                             d.DailyMovementDetails_Visible == "yes"
                    );
                    tracking.TotalPurchases = details.Sum(d => d.DailyMovementDetails_Total);

                    var expenses = _unitOfWork.DailyMovementExpenses.GetAll(
                        e => e.DailyMovementExpense_MovementID == movement.DailyMovement_ID &&
                             e.DailyMovementExpense_Visible == "yes"
                    );
                    tracking.TotalExpenses = expenses.Sum(e => e.DailyMovementExpense_Total);

                    var availableBalance = _unitOfWork.DailyMovementBalances.GetFirstOrDefault(
                        b => b.DailyMovementBalance_MovementID == movement.DailyMovement_ID &&
                             b.DailyMovementBalance_Type == "الرصيد المتوفر" &&
                             b.DailyMovementBalance_Visible == "yes"
                    );

                    tracking.AvailableBalance =
                        availableBalance?.DailyMovementBalance_Amount ??
                        CalculateAvailableBalance(movement.DailyMovement_ID);
                }
                else
                {
                    tracking.TotalPurchases = 0;
                    tracking.TotalExpenses = 0;
                    tracking.AvailableBalance = 0;
                }

                trackingList.Add(tracking);
            }

            ViewBag.SelectedDate = selectedDate;
            return View(trackingList);
        }

        private decimal CalculateAvailableBalance(int movementId)
        {
            try
            {
                var rasidSabiqBalance = _unitOfWork.DailyMovementBalances.GetFirstOrDefault(
                    b => b.DailyMovementBalance_MovementID == movementId &&
                         b.DailyMovementBalance_Type == "رصيد سابق" &&
                         b.DailyMovementBalance_Visible == "yes"
                );
                decimal rasidSabiq = rasidSabiqBalance?.DailyMovementBalance_Amount ?? 0;

                var details = _unitOfWork.DailyMovementDetails.GetAll(
                    d => d.DailyMovementDetails_MovementID == movementId &&
                         d.DailyMovementDetails_Visible == "yes" &&
                         d.DailyMovementDetails_PaymentType == "نقدا"
                );
                decimal cashSales = details.Sum(d => d.DailyMovementDetails_Total);

                var customers = _unitOfWork.DailyMovementCustomers.GetAll(
                    c => c.DailyMovementCustomer_MovementID == movementId &&
                         c.DailyMovementCustomer_Visible == "yes"
                );
                decimal customerPayments = customers.Sum(c => c.DailyMovementCustomer_Amount);

                var waridWithdrawal = _unitOfWork.DailyMovementWarid.GetFirstOrDefault(
                    w => w.DailyMovementWarid_ID == movementId &&
                         w.DailyMovementWarid_Visible == "yes"
                );
                decimal waridAmount = waridWithdrawal?.DailyMovementWarid_Amount ?? 0;

                var purchases = _unitOfWork.DailyMovementDetails.GetAll(
                    d => d.DailyMovementDetails_MovementID == movementId &&
                         d.DailyMovementDetails_Visible == "yes" &&
                         d.DailyMovementDetails_PaymentType == "نقدا"
                );
                decimal cashPurchases = purchases.Sum(d => d.DailyMovementDetails_Total);

                var suppliers = _unitOfWork.DailyMovementSuppliers.GetAll(
                    s => s.DailyMovementSupplier_MovementID == movementId &&
                         s.DailyMovementSupplier_Visible == "yes"
                );
                decimal supplierPayments = suppliers.Sum(s => s.DailyMovementSupplier_Amount);

                var taslimWithdrawal = _unitOfWork.DailyMovementTaslim.GetFirstOrDefault(
                    w => w.DailyMovementTaslim_MovementID == movementId &&
                         w.DailyMovementTaslim_Visible == "yes"
                );
                decimal taslimAmount = taslimWithdrawal?.DailyMovementTaslim_Amount ?? 0;

                var expenses = _unitOfWork.DailyMovementExpenses.GetAll(
                    e => e.DailyMovementExpense_MovementID == movementId &&
                         e.DailyMovementExpense_Visible == "yes"
                );
                decimal totalExpenses = expenses.Sum(e => e.DailyMovementExpense_Total);

                decimal totalPlus = cashSales + customerPayments + waridAmount;
                decimal totalMinus = cashPurchases + supplierPayments + taslimAmount + totalExpenses;
                decimal availableBalance = rasidSabiq + totalPlus - totalMinus;

                return availableBalance;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        // صفحة متابعة حركات المستودعات
        public async Task<IActionResult> WarehouseMovementsTracking(DateTime? date)
        {
            var selectedDate = date ?? DateTime.Today;

            var warehouseKeepers = await _userManager.Users
                .Where(u => u.Visible == "Yes")
                .OrderBy(u => u.UserName)
                .ToListAsync();

            var trackingList = new List<UserMovementTracking>();

            foreach (var keeper in warehouseKeepers)
            {
                var movement = _unitOfWork.WarehouseMovement.GetFirstOrDefault(
                    m => m.WarehouseMovement_UserID == keeper.Id &&
                         m.WarehouseMovement_Date.Date == selectedDate.Date &&
                         m.WarehouseMovement_Visible == "Yes"
                );

                var tracking = new UserMovementTracking
                {
                    UserId = keeper.Id,
                    UserName = keeper.UserName,
                    UserType = keeper.UserType,
                    MovementDate = selectedDate,
                    HasMovement = movement != null,
                    MovementId = movement?.WarehouseMovement_ID ?? 0,
                    LastUpdateDate = movement?.WarehouseMovement_EditDate ?? movement?.WarehouseMovement_AddDate
                };

                if (movement != null)
                {
                    var mortalities = _unitOfWork.WarehouseMortality.GetAll(
                        m => m.WarehouseMortality_MovementID == movement.WarehouseMovement_ID &&
                             m.WarehouseMortality_Visible == "Yes"
                    );
                    tracking.TotalMortality = mortalities.Sum(m => m.WarehouseMortality_Quantity);

                    var livestocks = _unitOfWork.WarehouseLivestock.GetAll(
                        l => l.WarehouseLivestock_MovementID == movement.WarehouseMovement_ID &&
                             l.WarehouseLivestock_Visible == "Yes"
                    );
                    tracking.TotalLivestock = livestocks.Sum(l => l.WarehouseLivestock_Quantity);

                    var outgoings = _unitOfWork.WarehouseOutgoing.GetAll(
                        o => o.WarehouseOutgoing_MovementID == movement.WarehouseMovement_ID &&
                             o.WarehouseOutgoing_Visible == "Yes"
                    );
                    tracking.TotalOutgoing = outgoings.Sum(o => o.WarehouseOutgoing_Quantity);
                }

                trackingList.Add(tracking);
            }

            ViewBag.SelectedDate = selectedDate;
            return View(trackingList);
        }

        // عرض تفاصيل حركة مندوب (للقراءة فقط)
        public IActionResult ViewDailyMovement(int movementId)
        {
            try
            {
                var movement = _unitOfWork.DailyMovement.GetFirstOrDefault(
                    m => m.DailyMovement_ID == movementId && m.DailyMovement_Visible == "yes"
                );

                if (movement == null)
                {
                    return NotFound();
                }

                var model = new ModelDailyMovement
                {
                    DailyMovement_ID = movement.DailyMovement_ID,
                    DailyMovement_Date = movement.DailyMovement_Date,
                    DailyMovement_UserID = movement.DailyMovement_UserID,
                    Details = new List<ModelDailyMovementDetails>(),
                    Sales = new List<ModelDailyMovementSales>(),
                    Expenses = new List<ModelDailyMovementExpenses>(),
                    Suppliers = new List<ModelDailyMovementSuppliers>(),
                    Customers = new List<ModelDailyMovementCustomers>(),
                    Warid = new List<ModelDailyMovementWarid>(),
                    Taslim = new List<ModelDailyMovementTaslim>(),
                    Balances = new List<ModelDailyMovementBalances>()
                };

                var details = _unitOfWork.DailyMovementDetails.GetAll(
                    d => d.DailyMovementDetails_MovementID == movement.DailyMovement_ID &&
                         d.DailyMovementDetails_Visible == "yes"
                );

                foreach (var detail in details)
                {
                    var product = _unitOfWork.Product.GetById(detail.DailyMovementDetails_ProductID);
                    model.Details.Add(new ModelDailyMovementDetails
                    {
                        DailyMovementDetails_ID = detail.DailyMovementDetails_ID,
                        DailyMovementDetails_ProductID = detail.DailyMovementDetails_ProductID,
                        Product_Name = product?.Product_Name ?? "",
                        DailyMovementDetails_Quantity = detail.DailyMovementDetails_Quantity,
                        DailyMovementDetails_Price = detail.DailyMovementDetails_Price,
                        DailyMovementDetails_Total = detail.DailyMovementDetails_Total,
                        DailyMovementDetails_PaymentType = detail.DailyMovementDetails_PaymentType,
                        DailyMovementDetails_Notes = detail.DailyMovementDetails_Notes
                    });
                }

                var sales = _unitOfWork.DailyMovementSales.GetAll(
                    d => d.DailyMovementSales_MovementID == movement.DailyMovement_ID &&
                         d.DailyMovementSales_Visible == "yes"
                );

                foreach (var sale in sales)
                {
                    var product = _unitOfWork.Product.GetById(sale.DailyMovementSales_ProductID);
                    model.Sales.Add(new ModelDailyMovementSales
                    {
                        DailyMovementSales_ID = sale.DailyMovementSales_ID,
                        DailyMovementSales_ProductID = sale.DailyMovementSales_ProductID,
                        Product_Name = product?.Product_Name ?? "",
                        DailyMovementSales_Quantity = sale.DailyMovementSales_Quantity,
                        DailyMovementSales_Price = sale.DailyMovementSales_Price,
                        DailyMovementSales_Total = sale.DailyMovementSales_Total,
                        DailyMovementSales_PaymentType = sale.DailyMovementSales_PaymentType,
                        DailyMovementSales_Notes = sale.DailyMovementSales_Notes
                    });
                }

                var expenses = _unitOfWork.DailyMovementExpenses.GetAll(
                    e => e.DailyMovementExpense_MovementID == movement.DailyMovement_ID &&
                         e.DailyMovementExpense_Visible == "yes"
                );

                foreach (var expense in expenses)
                {
                    //var category = _unitOfWork.Expense_Item.GetById(expense.DailyMovementExpense_CategoryID);
                    model.Expenses.Add(new ModelDailyMovementExpenses
                    {
                        DailyMovementExpense_ID = expense.DailyMovementExpense_ID,
                        DailyMovementExpense_CategoryID = (int)expense.DailyMovementExpense_CategoryID,
                        ExpenseCategory_Name = expense.DailyMovementExpense_CategoryName,
                        DailyMovementExpense_Quantity = expense.DailyMovementExpense_Quantity,
                        DailyMovementExpense_Amount = expense.DailyMovementExpense_Amount,
                        DailyMovementExpense_Total = expense.DailyMovementExpense_Total,
                        DailyMovementExpense_Notes = expense.DailyMovementExpense_Notes
                    });
                }

                var suppliers = _unitOfWork.DailyMovementSuppliers.GetAll(
                    s => s.DailyMovementSupplier_MovementID == movement.DailyMovement_ID &&
                         s.DailyMovementSupplier_Visible == "yes"
                );

                foreach (var supplier in suppliers)
                {
                    //var supplierInfo = _unitOfWork.Supplier.GetById(supplier.DailyMovementSupplier_SupplierID);
                    model.Suppliers.Add(new ModelDailyMovementSuppliers
                    {
                        DailyMovementSupplier_ID = supplier.DailyMovementSupplier_ID,
                        DailyMovementSupplier_SupplierID = (int)supplier.DailyMovementSupplier_SupplierID,
                        Supplier_Name = supplier.DailyMovementSupplier_SupplierName,
                        DailyMovementSupplier_Amount = supplier.DailyMovementSupplier_Amount,
                        DailyMovementSupplier_Notes = supplier.DailyMovementSupplier_Notes
                    });
                }

                var customers = _unitOfWork.DailyMovementCustomers.GetAll(
                    c => c.DailyMovementCustomer_MovementID == movement.DailyMovement_ID &&
                         c.DailyMovementCustomer_Visible == "yes"
                );

                foreach (var customer in customers)
                {
                    //var customerInfo = _unitOfWork.Customer.GetById(customer.DailyMovementCustomer_CustomerID);
                    model.Customers.Add(new ModelDailyMovementCustomers
                    {
                        DailyMovementCustomer_ID = customer.DailyMovementCustomer_ID,
                        DailyMovementCustomer_CustomerID = customer.DailyMovementCustomer_CustomerID,
                        //Customer_Name = customerInfo?.Customer_Name ?? "",
                        Customer_Name = customer.DailyMovementCustomer_CustomerName,
                        DailyMovementCustomer_Amount = customer.DailyMovementCustomer_Amount,
                        DailyMovementCustomer_Notes = customer.DailyMovementCustomer_Notes
                    });
                }

                var warids = _unitOfWork.DailyMovementWarid.GetAll(
                    w => w.DailyMovementWarid_MovementID == movement.DailyMovement_ID &&
                         w.DailyMovementWarid_Visible == "yes"
                );
                foreach (var warid in warids)
                {
                    var customerInfo = _unitOfWork.DailyMovementWarid.GetById(warid.DailyMovementWarid_MovementID);
                    model.Warid.Add(new ModelDailyMovementWarid
                    {
                        DailyMovementWarid_ID = warid.DailyMovementWarid_ID,
                        DailyMovementWarid_MovementID = warid.DailyMovementWarid_MovementID,
                        DailyMovementWarid_Amount = warid.DailyMovementWarid_Amount,
                        DailyMovementWarid_Notes = warid.DailyMovementWarid_Notes,
                        DailyMovementWarid_Receiver = warid.DailyMovementWarid_Receiver

                    });
                }


                var taslim = _unitOfWork.DailyMovementTaslim.GetAll(
                    t => t.DailyMovementTaslim_MovementID == movement.DailyMovement_ID &&
                        t.DailyMovementTaslim_Visible == "yes");

                foreach (var taslimItem in taslim)
                {
                    model.Taslim.Add(new ModelDailyMovementTaslim
                    {
                        DailyMovementTaslim_ID = taslimItem.DailyMovementTaslim_ID,
                        DailyMovementTaslim_MovementID = taslimItem.DailyMovementTaslim_MovementID,
                        DailyMovementTaslim_Amount = taslimItem.DailyMovementTaslim_Amount,
                        DailyMovementTaslim_Notes = taslimItem.DailyMovementTaslim_Notes,
                        DailyMovementTaslim_Receiver = taslimItem.DailyMovementTaslim_Receiver
                    });
                }

                    var balances = _unitOfWork.DailyMovementBalances.GetAll(
                    b => b.DailyMovementBalance_MovementID == movement.DailyMovement_ID &&
                         b.DailyMovementBalance_Visible == "yes"
                );

                foreach (var balance in balances)
                {
                    model.Balances.Add(new ModelDailyMovementBalances
                    {
                        DailyMovementBalance_ID = balance.DailyMovementBalance_ID,
                        DailyMovementBalance_Type = balance.DailyMovementBalance_Type,
                        DailyMovementBalance_Amount = balance.DailyMovementBalance_Amount,
                        DailyMovementBalance_Notes = balance.DailyMovementBalance_Notes
                    });
                }

                var user = _userManager.Users.FirstOrDefault(u => u.Id == movement.DailyMovement_UserID);
                ViewBag.UserName = user?.UserName ?? "غير معروف";
                ViewBag.IsReadOnly = true;

                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "حدث خطأ أثناء تحميل البيان: " + ex.Message;
                return View();
            }
        }


        // عرض تفاصيل حركة مستودع (للقراءة فقط)
        public async Task<IActionResult> ViewWarehouseMovement(int movementId)
        {
            try
            {
                var movement = _unitOfWork.WarehouseMovement.GetById(movementId);

                if (movement == null || movement.WarehouseMovement_Visible != "Yes")
                {
                    return NotFound();
                }

                var model = new ModelWarehouseMovement
                {
                    WarehouseMovement_ID = movement.WarehouseMovement_ID,
                    WarehouseMovement_Date = movement.WarehouseMovement_Date,
                    WarehouseMovement_UserID = movement.WarehouseMovement_UserID
                };

                model.Mortalities = _unitOfWork.WarehouseMortality.GetAll(
                    m => m.WarehouseMortality_MovementID == movement.WarehouseMovement_ID &&
                         m.WarehouseMortality_Visible == "Yes"
                ).ToList();

                model.Livestocks = _unitOfWork.WarehouseLivestock.GetAll(
                    l => l.WarehouseLivestock_MovementID == movement.WarehouseMovement_ID &&
                         l.WarehouseLivestock_Visible == "Yes"
                ).ToList();

                model.Outgoings = _unitOfWork.WarehouseOutgoing.GetAll(
                    o => o.WarehouseOutgoing_MovementID == movement.WarehouseMovement_ID &&
                         o.WarehouseOutgoing_Visible == "Yes"
                ).ToList();

                ViewBag.Products = _unitOfWork.Product.GetAll(p => p.Product_Visible == "Yes").ToList();

                var user = await _userManager.FindByIdAsync(movement.WarehouseMovement_UserID);
                ViewBag.UserName = user?.UserName ?? "غير معروف";
                ViewBag.IsReadOnly = true;

                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "حدث خطأ أثناء تحميل البيان: " + ex.Message;
                return View();
            }
        }


        public IActionResult ViewAllMovments()
        {
            return View();
        }
        public IActionResult ViewAllDailyMovements(DateTime? date = null)
        {
            try
            {
                DateTime targetDate = date ?? DateTime.Today;

                var movements = _unitOfWork.DailyMovement.GetAll(
                    m => m.DailyMovement_Date == targetDate &&
                         m.DailyMovement_Visible == "yes"
                ).ToList();

                var model = new List<ModelDailyMovement>();

                foreach (var movement in movements)
                {
                    var movementModel = new ModelDailyMovement
                    {
                        DailyMovement_ID = movement.DailyMovement_ID,
                        DailyMovement_Date = movement.DailyMovement_Date,
                        DailyMovement_UserID = movement.DailyMovement_UserID,
                        Details = new List<ModelDailyMovementDetails>(),
                        Sales = new List<ModelDailyMovementSales>(),
                        Expenses = new List<ModelDailyMovementExpenses>(),
                        Suppliers = new List<ModelDailyMovementSuppliers>(),
                        Customers = new List<ModelDailyMovementCustomers>(),
                        Warid = new List<ModelDailyMovementWarid>(),
                        Taslim = new List<ModelDailyMovementTaslim>(),
                        Balances = new List<ModelDailyMovementBalances>()
                    };

                    var user = _userManager.Users.FirstOrDefault(u => u.Id == movement.DailyMovement_UserID);
                    movementModel.userName = user?.UserName ?? "غير معروف";

                    var details = _unitOfWork.DailyMovementDetails.GetAll(
                        d => d.DailyMovementDetails_MovementID == movement.DailyMovement_ID &&
                             d.DailyMovementDetails_Visible == "yes"
                    );

                    foreach (var detail in details)
                    {
                        var product = _unitOfWork.Product.GetById(detail.DailyMovementDetails_ProductID);
                        movementModel.Details.Add(new ModelDailyMovementDetails
                        {
                            DailyMovementDetails_ID = detail.DailyMovementDetails_ID,
                            DailyMovementDetails_ProductID = detail.DailyMovementDetails_ProductID,
                            Product_Name = product?.Product_Name ?? "",
                            DailyMovementDetails_Quantity = detail.DailyMovementDetails_Quantity,
                            DailyMovementDetails_Price = detail.DailyMovementDetails_Price,
                            DailyMovementDetails_Total = detail.DailyMovementDetails_Total,
                            DailyMovementDetails_PaymentType = detail.DailyMovementDetails_PaymentType,
                            DailyMovementDetails_Notes = detail.DailyMovementDetails_Notes
                        });
                    }

                    var sales = _unitOfWork.DailyMovementSales.GetAll(
                        d => d.DailyMovementSales_MovementID == movement.DailyMovement_ID &&
                             d.DailyMovementSales_Visible == "yes"
                    );

                    foreach (var sale in sales)
                    {
                        var product = _unitOfWork.Product.GetById(sale.DailyMovementSales_ProductID);
                        movementModel.Sales.Add(new ModelDailyMovementSales
                        {
                            DailyMovementSales_ID = sale.DailyMovementSales_ID,
                            DailyMovementSales_ProductID = sale.DailyMovementSales_ProductID,
                            Product_Name = product?.Product_Name ?? "",
                            DailyMovementSales_Quantity = sale.DailyMovementSales_Quantity,
                            DailyMovementSales_Price = sale.DailyMovementSales_Price,
                            DailyMovementSales_Total = sale.DailyMovementSales_Total,
                            DailyMovementSales_PaymentType = sale.DailyMovementSales_PaymentType,
                            DailyMovementSales_Notes = sale.DailyMovementSales_Notes
                        });
                    }

                    var expenses = _unitOfWork.DailyMovementExpenses.GetAll(
                        e => e.DailyMovementExpense_MovementID == movement.DailyMovement_ID &&
                             e.DailyMovementExpense_Visible == "yes"
                    );

                    foreach (var expense in expenses)
                    {
                        //var category = _unitOfWork.Expense_Item.GetById(expense.DailyMovementExpense_CategoryID);
                        movementModel.Expenses.Add(new ModelDailyMovementExpenses
                        {
                            DailyMovementExpense_ID = expense.DailyMovementExpense_ID,
                            DailyMovementExpense_CategoryID = expense.DailyMovementExpense_CategoryID ?? 0,
                            ExpenseCategory_Name =expense.DailyMovementExpense_CategoryName,
                            DailyMovementExpense_Quantity = expense.DailyMovementExpense_Quantity,
                            DailyMovementExpense_Amount = expense.DailyMovementExpense_Amount,
                            DailyMovementExpense_Total = expense.DailyMovementExpense_Total,
                            DailyMovementExpense_Notes = expense.DailyMovementExpense_Notes
                        });
                    }

                    var suppliers = _unitOfWork.DailyMovementSuppliers.GetAll(
                        s => s.DailyMovementSupplier_MovementID == movement.DailyMovement_ID &&
                             s.DailyMovementSupplier_Visible == "yes"
                    );

                    foreach (var supplier in suppliers)
                    {
                        //var supplierInfo = _unitOfWork.Supplier.GetById(supplier.DailyMovementSupplier_SupplierID);
                        movementModel.Suppliers.Add(new ModelDailyMovementSuppliers
                        {
                            DailyMovementSupplier_ID = supplier.DailyMovementSupplier_ID,
                            DailyMovementSupplier_SupplierID = supplier.DailyMovementSupplier_SupplierID ?? 0,
                            Supplier_Name = supplier.DailyMovementSupplier_SupplierName,
                            DailyMovementSupplier_Amount = supplier.DailyMovementSupplier_Amount,
                            DailyMovementSupplier_Notes = supplier.DailyMovementSupplier_Notes
                        });
                    }

                    var customers = _unitOfWork.DailyMovementCustomers.GetAll(
                        c => c.DailyMovementCustomer_MovementID == movement.DailyMovement_ID &&
                             c.DailyMovementCustomer_Visible == "yes"
                    );

                    foreach (var customer in customers)
                    {
                        //var customerInfo = _unitOfWork.Customer.GetById(customer.DailyMovementCustomer_CustomerID);
                        movementModel.Customers.Add(new ModelDailyMovementCustomers
                        {
                            DailyMovementCustomer_ID = customer.DailyMovementCustomer_ID,
                            DailyMovementCustomer_CustomerID = customer.DailyMovementCustomer_CustomerID,
                            Customer_Name = customer.DailyMovementCustomer_CustomerName ?? "",
                            DailyMovementCustomer_Amount = customer.DailyMovementCustomer_Amount,
                            DailyMovementCustomer_Notes = customer.DailyMovementCustomer_Notes
                        });
                    }

                    var warids = _unitOfWork.DailyMovementWarid.GetAll(
                        w => w.DailyMovementWarid_MovementID == movement.DailyMovement_ID &&
                             w.DailyMovementWarid_Visible == "yes"
                    );
                    foreach (var warid in warids)
                    {
                        movementModel.Warid.Add(new ModelDailyMovementWarid
                        {
                            DailyMovementWarid_ID = warid.DailyMovementWarid_ID,
                            DailyMovementWarid_MovementID = warid.DailyMovementWarid_MovementID,
                            DailyMovementWarid_Amount = warid.DailyMovementWarid_Amount,
                            DailyMovementWarid_Notes = warid.DailyMovementWarid_Notes,
                            DailyMovementWarid_Receiver = warid.DailyMovementWarid_Receiver
                        });
                    }

                    var taslim = _unitOfWork.DailyMovementTaslim.GetAll(
                        t => t.DailyMovementTaslim_MovementID == movement.DailyMovement_ID &&
                            t.DailyMovementTaslim_Visible == "yes");

                    foreach (var taslimItem in taslim)
                    {
                        movementModel.Taslim.Add(new ModelDailyMovementTaslim
                        {
                            DailyMovementTaslim_ID = taslimItem.DailyMovementTaslim_ID,
                            DailyMovementTaslim_MovementID = taslimItem.DailyMovementTaslim_MovementID,
                            DailyMovementTaslim_Amount = taslimItem.DailyMovementTaslim_Amount,
                            DailyMovementTaslim_Notes = taslimItem.DailyMovementTaslim_Notes,
                            DailyMovementTaslim_Receiver = taslimItem.DailyMovementTaslim_Receiver
                        });
                    }

                    var balances = _unitOfWork.DailyMovementBalances.GetAll(
                        b => b.DailyMovementBalance_MovementID == movement.DailyMovement_ID &&
                             b.DailyMovementBalance_Visible == "yes"
                    );

                    foreach (var balance in balances)
                    {
                        movementModel.Balances.Add(new ModelDailyMovementBalances
                        {
                            DailyMovementBalance_ID = balance.DailyMovementBalance_ID,
                            DailyMovementBalance_Type = balance.DailyMovementBalance_Type,
                            DailyMovementBalance_Amount = balance.DailyMovementBalance_Amount,
                            DailyMovementBalance_Notes = balance.DailyMovementBalance_Notes
                        });
                    }

                    model.Add(movementModel);
                }

                ViewBag.TargetDate = targetDate.ToString("yyyy-MM-dd");
                ViewBag.IsReadOnly = true;

                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "حدث خطأ أثناء تحميل البيانات: " + ex.Message;
                return View(new List<ModelDailyMovement>());
            }
        }
    }
}