using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Sales.Helper;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;


namespace Sales.Controllers
{
    [Authorize]
    public class DailyMovementController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        string Title = "بيان الحركة اليومية";

        public DailyMovementController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult Index(string targetUserId = null, DateTime? targetDate = null)
        {
            try
            {
                var userId = targetUserId ?? _userManager.GetUserId(User);
                var date = targetDate ?? DateTime.Today;

                var param = new DynamicParameters();
                param.Add("@UserId", userId);
                param.Add("@TargetDate", date);

                var result = _unitOfWork.SP_Call.MultiList("SP_GetDailyMovementData", param);

                var movement = result.Movement.FirstOrDefault();
                var details = result.Details.ToList();
                var sales = result.Sales.ToList();
                var expenses = result.Expenses.ToList();
                var suppliers = result.Suppliers.ToList();
                var customers = result.Customers.ToList();
                var taslim = result.Taslim.ToList();
                var warid = result.Warid.ToList();
                var balances = result.Balances.ToList();
                var previousBalance = result.PreviousBalance ?? 0;


                var model = movement ?? new ModelDailyMovement
                {
                    DailyMovement_Date = date,
                    DailyMovement_UserID = userId,
                    userName = _unitOfWork.ApplicationUser.GetById(userId)?.UserName ?? "",
                    Details = new List<ModelDailyMovementDetails>(),
                    Sales = new List<ModelDailyMovementSales>(),
                    Expenses = new List<ModelDailyMovementExpenses>(),
                    Suppliers = new List<ModelDailyMovementSuppliers>(),
                    Customers = new List<ModelDailyMovementCustomers>(),
                    Taslim = new List<ModelDailyMovementTaslim>(),
                    Warid = new List<ModelDailyMovementWarid>(),
                    Balances = new List<ModelDailyMovementBalances>()
                };

                model.Details = details;
                model.Sales = sales;
                model.Expenses = expenses;
                model.Suppliers = suppliers;
                model.Customers = customers;
                model.Taslim = taslim;
                model.Warid = warid;
                model.Balances = balances;
                

                ViewBag.PreviousBalance = previousBalance;
                ViewBag.Products = _unitOfWork.Product.GetAll(p => p.Product_Visible == "yes").ToList();
                ViewBag.ExpenseCategories = _unitOfWork.Expense_Item.GetAll(e => e.ExpenseItem_Visible == "yes").ToList();
                ViewBag.Suppliers = _unitOfWork.Supplier.GetAll(s => s.Supplier_Visible == "yes").ToList();
                ViewBag.Customers = _unitOfWork.Customer.GetAll(c => c.Customer_Visible == "yes").ToList();

                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "حدث خطأ أثناء تحميل البيانات: " + ex.Message;
                return View(new ModelDailyMovement
                {
                    Details = new List<ModelDailyMovementDetails>(),
                    Sales = new List<ModelDailyMovementSales>(),
                    Expenses = new List<ModelDailyMovementExpenses>(),
                    Suppliers = new List<ModelDailyMovementSuppliers>(),
                    Customers = new List<ModelDailyMovementCustomers>(),
                    Taslim = new List<ModelDailyMovementTaslim>(),
                    Warid = new List<ModelDailyMovementWarid>(),
                    Balances = new List<ModelDailyMovementBalances>()
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveMovement([FromBody] ModelDailyMovement model)
        {
            try
            {
                ConvertArabicNumbers(model);

                var userId = model.DailyMovement_UserID ?? _userManager.GetUserId(User);
                var date = model.DailyMovement_Date == default ? DateTime.Today : model.DailyMovement_Date;

                var param = new DynamicParameters();
                param.Add("@UserId", userId);
                param.Add("@TargetDate", date);
                param.Add("@DetailsJson", JsonConvert.SerializeObject(model.Details ?? new List<ModelDailyMovementDetails>()));
                param.Add("@SalesJson", JsonConvert.SerializeObject(model.Sales ?? new List<ModelDailyMovementSales>()));
                param.Add("@ExpensesJson", JsonConvert.SerializeObject(model.Expenses ?? new List<ModelDailyMovementExpenses>()));
                param.Add("@SuppliersJson", JsonConvert.SerializeObject(model.Suppliers ?? new List<ModelDailyMovementSuppliers>()));
                param.Add("@CustomersJson", JsonConvert.SerializeObject(model.Customers ?? new List<ModelDailyMovementCustomers>()));
                param.Add("@TaslimJson", JsonConvert.SerializeObject(model.Taslim ?? new List<ModelDailyMovementTaslim>()));
                param.Add("@WaridJson", JsonConvert.SerializeObject(model.Warid ?? new List<ModelDailyMovementWarid>()));

                var movementId = _unitOfWork.SP_Call.OneRecord<int>("SP_SaveDailyMovementComplete", param);

                var balanceParam = new DynamicParameters();
                balanceParam.Add("@UserId", userId);
                balanceParam.Add("@FromDate", date);
                _unitOfWork.SP_Call.Execute("SP_RecalculateBalances", balanceParam);

                return Json(new { isValid = true, title = "نجح", message = "تم الحفظ بنجاح" });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    isValid = false,
                    title = "خطأ",
                    message = "حدث خطأ أثناء الحفظ: " + ex.Message
                });
            }
        }

        private void ConvertArabicNumbers(ModelDailyMovement model)
        {
            model.Details?.ForEach(d =>
            {
                d.DailyMovementDetails_Price = decimal.Parse(d.DailyMovementDetails_Price.ToString().ToEnglishDigits());
                d.DailyMovementDetails_Total = decimal.Parse(d.DailyMovementDetails_Total.ToString().ToEnglishDigits());
                d.DailyMovementDetails_Quantity = int.Parse(d.DailyMovementDetails_Quantity.ToString().ToEnglishDigits());
            });

            model.Sales?.ForEach(s =>
            {
                s.DailyMovementSales_Price = decimal.Parse(s.DailyMovementSales_Price.ToString().ToEnglishDigits());
                s.DailyMovementSales_Total = decimal.Parse(s.DailyMovementSales_Total.ToString().ToEnglishDigits());
                s.DailyMovementSales_Quantity = int.Parse(s.DailyMovementSales_Quantity.ToString().ToEnglishDigits());
            });

            model.Expenses?.ForEach(e =>
            {
                e.DailyMovementExpense_Amount = decimal.Parse(e.DailyMovementExpense_Amount.ToString().ToEnglishDigits());
                e.DailyMovementExpense_Total = decimal.Parse(e.DailyMovementExpense_Total.ToString().ToEnglishDigits());
                e.DailyMovementExpense_Quantity = int.Parse(e.DailyMovementExpense_Quantity.ToString().ToEnglishDigits());
            });

            model.Suppliers?.ForEach(s =>
            {
                s.DailyMovementSupplier_Amount = decimal.Parse(s.DailyMovementSupplier_Amount.ToString().ToEnglishDigits());
            });

            model.Customers?.ForEach(c =>
            {
                c.DailyMovementCustomer_Amount = decimal.Parse(c.DailyMovementCustomer_Amount.ToString().ToEnglishDigits());
            });

            model.Taslim?.ForEach(t =>
            {
                t.DailyMovementTaslim_Amount = decimal.Parse(t.DailyMovementTaslim_Amount.ToString().ToEnglishDigits());
            });

            model.Warid?.ForEach(w =>
            {
                w.DailyMovementWarid_Amount = decimal.Parse(w.DailyMovementWarid_Amount.ToString().ToEnglishDigits());
            });
        }

    }

}