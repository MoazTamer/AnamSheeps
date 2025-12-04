using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;

namespace Sales.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private static TimeZoneInfo Arabian_Standard_Time =
            TimeZoneInfo.FindSystemTimeZoneById("Arab Standard Time");
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IAuthorizationService _authorizationService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;


        public HomeController(SignInManager<ApplicationUser> signInManager, IUnitOfWork unitOfWork, IAuthorizationService authorizationService, UserManager<ApplicationUser> userManager)
        {
            _signInManager = signInManager;
            _unitOfWork = unitOfWork;
            _authorizationService = authorizationService;
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult Index()
        {

            var userName = User.Identity?.Name;

            string userType = string.Empty;

            if (!string.IsNullOrEmpty(userName))
            {
                var user = _unitOfWork.ApplicationUser.GetFirstOrDefault(u => u.UserName == userName);
                if (user != null)
                {
                    userType = user.UserType;
                }
            }

            ViewBag.UserType = userType;
            return View();
        }

        [HttpGet]
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

                // المشتريات
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

                // المبيعات
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

                // المصروفات
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
                        DailyMovementExpense_CategoryID = expense.DailyMovementExpense_CategoryID ?? 0,
                        //ExpenseCategory_Name = expense.DailyMovementExpense_CategoryName,
                        DailyMovementExpense_CategoryName = expense.DailyMovementExpense_CategoryName ?? "",
                        DailyMovementExpense_Quantity = expense.DailyMovementExpense_Quantity,
                        DailyMovementExpense_Amount = expense.DailyMovementExpense_Amount,
                        DailyMovementExpense_Total = expense.DailyMovementExpense_Total,
                        DailyMovementExpense_Notes = expense.DailyMovementExpense_Notes
                    });
                }

                // الموردين
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
                        DailyMovementSupplier_SupplierID = supplier.DailyMovementSupplier_SupplierID ?? 0,
                        Supplier_Name = supplier.DailyMovementSupplier_SupplierName,
                        DailyMovementSupplier_SupplierName = supplier.DailyMovementSupplier_SupplierName ?? "",
                        DailyMovementSupplier_PaymentType = supplier.DailyMovementSupplier_PaymentType,
                        DailyMovementSupplier_Amount = supplier.DailyMovementSupplier_Amount,
                        DailyMovementSupplier_Notes = supplier.DailyMovementSupplier_Notes
                    });
                }

                // العملاء
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
                        DailyMovementCustomer_CustomerName = customer.DailyMovementCustomer_CustomerName,
                        DailyMovementCustomer_PaymentType = customer.DailyMovementCustomer_PaymentType,
                        DailyMovementCustomer_Amount = customer.DailyMovementCustomer_Amount,
                        DailyMovementCustomer_Notes = customer.DailyMovementCustomer_Notes
                    });
                }

                // الوارد من الإدارة
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


                // تسليم للادارة
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

                // الأرصدة
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

                // جلب معلومات المستخدم
                var user = _userManager.Users.FirstOrDefault(u => u.Id == movement.DailyMovement_UserID);
                ViewBag.UserName = user?.UserName ?? "غير معروف";
                ViewBag.IsReadOnly = true;

                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.Type = "error";
                ViewBag.IsReadOnly = true;
                ViewBag.Message = "حدث خطأ أثناء تحميل البيان: " + ex.Message;
                return View();
            }
        }

        public IActionResult PreviousDailyMovement(DateTime? date)
        {
            try
            {
                DateTime selectedDate = date ?? DateTime.Today;
                var userId = _userManager.GetUserId(User);

                DateTime start = selectedDate.Date;
                DateTime end = start.AddDays(1);

                var movement = _unitOfWork.DailyMovement.GetFirstOrDefault(
                    m => m.DailyMovement_UserID == userId
                    && m.DailyMovement_Date >= start
                    && m.DailyMovement_Date < end
                    && m.DailyMovement_Visible == "yes"
                );

                if (movement == null)
                {
                    ViewBag.HasMovement = false;
                    ViewBag.SelectedDate = selectedDate;
                    return View(new ModelDailyMovement());
                }

                ViewBag.HasMovement = true;
                ViewBag.SelectedDate = selectedDate;

                return RedirectToAction("ViewDailyMovement", new { movementId = movement.DailyMovement_ID });
            }
            catch (Exception ex)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "حدث خطأ أثناء تحميل التقرير: " + ex.Message;
                return View();
            }
        }

        [HttpPost]
        public async Task<IActionResult> SignOut()
        {
            await _signInManager.SignOutAsync();
            return Redirect("/Login");
        }

        [HttpGet]
        public IActionResult Error()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Authorized()
        {
            return View();
        }
    }
}