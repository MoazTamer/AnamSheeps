using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ReportingServices.ReportProcessing.ReportObjectModel;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;

namespace Sales.Controllers
{
    //[Authorize(Roles = "إدارة")]
    public class ManagementDashboardController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public ManagementDashboardController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }


        public async Task<IActionResult> DailyMovementsTracking(DateTime? date)
        {
            var selectedDate = date ?? DateTime.Today;

            var param = new DynamicParameters();
            param.Add("@TargetDate", selectedDate);

            var spResult = _unitOfWork.SP_Call.DailyMovementList("SP_GetDailyMovementsTracking", param);

            var users = spResult.Users.ToList();
            var todayMov = spResult.TodayMovements.ToList();
            var lastMov = spResult.LastMovements.ToList();

            var trackingList = new List<UserMovementTracking>();

            foreach (var user in users)
            {
                var movementToday = todayMov.FirstOrDefault(m => m.DailyMovement_UserID == user.Id);

                var lastMovement = movementToday
                    ?? lastMov.FirstOrDefault(m => m.DailyMovement_UserID == user.Id);

                int movementId = movementToday?.DailyMovement_ID ?? lastMovement?.DailyMovement_ID ?? 0;

                decimal finalBalance = lastMovement?.DailyMovement_FinalBalance ?? 0;

                trackingList.Add(new UserMovementTracking
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    UserType = user.UserType,

                    MovementDate = selectedDate,
                    HasMovement = movementToday != null,
                    MovementId = movementId,


                    LastBalance = finalBalance,

                    LastUpdateDate = lastMovement?.DailyMovement_EditDate
                                     ?? lastMovement?.DailyMovement_AddDate,

                    AvailableBalance = finalBalance
                });
            }

            ViewBag.SelectedDate = selectedDate;
            return View(trackingList);
        }


       
        public IActionResult ViewDailyMovement(int movementId)
        {
            var param = new DynamicParameters();
            param.Add("@MovementId", movementId);

            var data = _unitOfWork.SP_Call.ViewDailyMovement("SP_ViewDailyMovement", param);

            if (data.OneMovement == null)
                return NotFound();

            var model = data.OneMovement;


            model.Details = (List<ModelDailyMovementDetails>)data.Details;
            model.Sales = (List<ModelDailyMovementSales>)data.Sales;
            model.Expenses = (List<ModelDailyMovementExpenses>)data.Expenses;
            model.Suppliers = (List<ModelDailyMovementSuppliers>)data.Suppliers;
            model.Customers = (List<ModelDailyMovementCustomers>)data.Customers;
            model.Warid = (List<ModelDailyMovementWarid>)data.Warid;
            model.Taslim = (List<ModelDailyMovementTaslim>)data.Taslim;
            model.Balances = (List<ModelDailyMovementBalances>)data.Balances;

            var user = _userManager.Users.FirstOrDefault(u => u.Id == model.DailyMovement_UserID);

            ViewBag.UserName = user?.UserName ?? "غير معروف";
            ViewBag.IsReadOnly = true;

            return View(model);
        }


        public IActionResult ViewAllMovments()
        {
            return View();
        }

        [HttpGet]
        public IActionResult ViewAllDailyMovements(DateTime? date = null)
        {
            DateTime targetDate = date ?? DateTime.Today;

            var param = new DynamicParameters();
            param.Add("@TargetDate", targetDate);

            var data = _unitOfWork.SP_Call.ViewAllDailyMovementsSP("SP_ViewAllDailyMovements", param);

            var model = new List<ModelDailyMovement>();

            foreach (var movement in data.Movement)
            {
                var movementModel = movement;

                movementModel.Details = data.Details
                    .Where(d => d.DailyMovementDetails_MovementID == movement.DailyMovement_ID)
                    .ToList();

                movementModel.Sales = data.Sales
                    .Where(s => s.DailyMovementSales_MovementID == movement.DailyMovement_ID)
                    .ToList();

                movementModel.Expenses = data.Expenses
                    .Where(e => e.DailyMovementExpense_MovementID == movement.DailyMovement_ID)
                    .ToList();

                movementModel.Suppliers = data.Suppliers
                    .Where(s => s.DailyMovementSupplier_MovementID == movement.DailyMovement_ID)
                    .ToList();

                movementModel.Customers = data.Customers
                    .Where(c => c.DailyMovementCustomer_MovementID == movement.DailyMovement_ID)
                    .ToList();

                movementModel.Warid = data.Warid
                    .Where(w => w.DailyMovementWarid_MovementID == movement.DailyMovement_ID)
                    .ToList();

                movementModel.Taslim = data.Taslim
                    .Where(t => t.DailyMovementTaslim_MovementID == movement.DailyMovement_ID)
                    .ToList();

                movementModel.Balances = data.Balances
                    .Where(b => b.DailyMovementBalance_MovementID == movement.DailyMovement_ID)
                    .ToList();

                var user = _userManager.Users.FirstOrDefault(u => u.Id == movement.DailyMovement_UserID);
                movementModel.userName = user?.UserName ?? "غير معروف";

                model.Add(movementModel);
            }

            ViewBag.TargetDate = targetDate.ToString("yyyy-MM-dd");
            ViewBag.IsReadOnly = true;

            return View(model);
        }



        public async Task<IActionResult> WarehouseMovementsTracking(DateTime? date)
        {
            var selectedDate = date ?? DateTime.Today;

            var warehouseKeepers = await _userManager.Users
                .Where(u => u.Visible == "Yes")
                .OrderBy(u => u.UserName)
                .ToListAsync();

            var movements = _unitOfWork.WarehouseMovement.GetAll(m =>
                m.WarehouseMovement_Date.Date == selectedDate.Date &&
                m.WarehouseMovement_Visible == "Yes"
            ).ToList();

            var mortalities = _unitOfWork.WarehouseMortality.GetAll(m => m.WarehouseMortality_Visible == "Yes").ToList();
            var livestocks = _unitOfWork.WarehouseLivestock.GetAll(l => l.WarehouseLivestock_Visible == "Yes").ToList();
            var outgoings = _unitOfWork.WarehouseOutgoing.GetAll(o => o.WarehouseOutgoing_Visible == "Yes").ToList();

            var trackingList = new List<UserMovementTracking>();

            foreach (var keeper in warehouseKeepers)
            {
                var movement = movements.FirstOrDefault(m => m.WarehouseMovement_UserID == keeper.Id);

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
                    tracking.TotalMortality = mortalities
                        .Where(m => m.WarehouseMortality_MovementID == movement.WarehouseMovement_ID)
                        .Sum(m => m.WarehouseMortality_Quantity);

                    tracking.TotalLivestock = livestocks
                        .Where(l => l.WarehouseLivestock_MovementID == movement.WarehouseMovement_ID)
                        .Sum(l => l.WarehouseLivestock_Quantity);

                    tracking.TotalOutgoing = outgoings
                        .Where(o => o.WarehouseOutgoing_MovementID == movement.WarehouseMovement_ID)
                        .Sum(o => o.WarehouseOutgoing_Quantity);
                }

                trackingList.Add(tracking);
            }

            ViewBag.SelectedDate = selectedDate;
            return View(trackingList);
        }

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

    }

}