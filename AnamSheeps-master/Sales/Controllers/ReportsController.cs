using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SalesModel.IRepository;
using SalesModel.Models;

namespace Sales.Controllers
{
    public class ReportsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public ReportsController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [Authorize(Policy = "PurchasesReport")]
        public IActionResult PurchasesReport()
        {
            return View();
        }

        [Authorize(Policy = "SalesReport")]
        public IActionResult SalesReport()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetPurchases(string fromDate = null, string toDate = null)
        {
            try
            {
                var purchases = _unitOfWork.DailyMovementDetails.GetAll(
                    includeProperties: new string[] { "DailyMovement", "Product" }
                );

                DateTime? parsedFromDate = null;
                DateTime? parsedToDate = null;

                if (!string.IsNullOrEmpty(fromDate) && DateTime.TryParse(fromDate, out DateTime fromDateTemp))
                    parsedFromDate = fromDateTemp.Date;

                if (!string.IsNullOrEmpty(toDate) && DateTime.TryParse(toDate, out DateTime toDateTemp))
                    parsedToDate = toDateTemp.Date.AddDays(1).AddSeconds(-1);

                if (parsedFromDate.HasValue)
                    purchases = purchases.Where(s => s.DailyMovement.DailyMovement_Date >= parsedFromDate.Value);

                if (parsedToDate.HasValue)
                    purchases = purchases.Where(s => s.DailyMovement.DailyMovement_Date <= parsedToDate.Value && s.DailyMovementDetails_Visible == "yes");

                var users = _userManager.Users.ToList();

                var data = purchases.Select(a => new
                {
                    a.DailyMovementDetails_ID,
                    Date = a.DailyMovement.DailyMovement_Date.ToString("yyyy-MM-dd"),
                    UserName = users.FirstOrDefault(u => u.Id == a.DailyMovement.DailyMovement_UserID)?.UserName ?? "غير معروف",
                    ProductName = a.Product?.Product_Name,
                    Quantity = a.DailyMovementDetails_Quantity,
                    Price = a.DailyMovementDetails_Price,
                    Total = a.DailyMovementDetails_Total,
                    PaymentType = a.DailyMovementDetails_PaymentType
                }).ToList();

                return Json(new { data });
            }
            catch (Exception)
            {
                return Json(new { data = new List<object>() });
            }
        }

        [HttpGet]
        public IActionResult GetSales(string fromDate = null, string toDate = null)
        {
            try
            {
                var sales = _unitOfWork.DailyMovementSales.GetAll(includeProperties: new string[] { "DailyMovement", "Product" });

                DateTime? parsedFromDate = null;
                DateTime? parsedToDate = null;

                if (!string.IsNullOrEmpty(fromDate) && DateTime.TryParse(fromDate, out DateTime fromDateTemp))
                {
                    parsedFromDate = fromDateTemp.Date;
                }

                if (!string.IsNullOrEmpty(toDate) && DateTime.TryParse(toDate, out DateTime toDateTemp))
                {
                    parsedToDate = toDateTemp.Date.AddDays(1).AddSeconds(-1); 
                }

                if (parsedFromDate.HasValue)
                {
                    sales = sales.Where(s => s.DailyMovement.DailyMovement_Date >= parsedFromDate.Value && s.DailyMovementSales_Visible == "yes");
                }

                if (parsedToDate.HasValue)
                {
                    sales = sales.Where(s => s.DailyMovement.DailyMovement_Date <= parsedToDate.Value);
                }

                var users = _userManager.Users.ToList();

                var data = sales.Select(a => new
                {
                    a.DailyMovementSales_ID,
                    Date = a.DailyMovement.DailyMovement_Date.ToString("yyyy-MM-dd"),
                    UserName = users.FirstOrDefault(u => u.Id == a.DailyMovement.DailyMovement_UserID)?.UserName ?? "غير معروف",
                    ProductName = a.Product?.Product_Name,
                    Quantity = a.DailyMovementSales_Quantity,
                    Price = a.DailyMovementSales_Price,
                    Total = a.DailyMovementSales_Total,
                    PaymentType = a.DailyMovementSales_PaymentType
                }).ToList();

                return Json(new { data });
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<object>() });
            }
        }
    }
}
