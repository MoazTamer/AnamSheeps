using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;
using SalesRepository.Data;
using System.Security.Claims;

namespace Sales.Controllers
{
    [Authorize]
    public class WarehouseMovementController : Controller
    {
        private readonly SalesDBContext _context;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public WarehouseMovementController(SalesDBContext context, IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }


        public IActionResult Index()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var today = DateTime.Today;

                var param = new DynamicParameters();
                param.Add("@UserId", userId);
                param.Add("@TargetDate", today);

                var data = _unitOfWork.SP_Call.MultiListWarehouse("SP_GetWarehouseMovementData", param);

                var movement = data.Movement.FirstOrDefault();

                var model = new ModelWarehouseMovement
                {
                    WarehouseMovement_ID = movement?.WarehouseMovement_ID ?? 0,
                    WarehouseMovement_Date = movement?.WarehouseMovement_Date ?? today,
                    WarehouseMovement_UserID = movement?.WarehouseMovement_UserID ?? userId,

                    Mortalities = data.Mortalities?.ToList() ?? new List<TblWarehouseMortality>(),
                    Livestocks = data.Livestocks?.ToList() ?? new List<TblWarehouseLivestock>(),
                    Outgoings = data.Outgoings?.ToList() ?? new List<TblWarehouseOutgoing>()
                };

                ViewBag.Products = data.Products?.ToList() ?? new List<TblProduct>();
                ViewBag.Delegates = data.Delegates?.ToList() ?? new List<TblCustomer>();

                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "حدث خطأ أثناء تحميل البيانات: " + ex.Message;

                return View(new ModelWarehouseMovement
                {
                    WarehouseMovement_Date = DateTime.Today
                });
            }
        }

        [HttpPost]
        public IActionResult Save([FromBody] ModelWarehouseMovement model)
        {
            if (model == null)
                return Json(new { success = false, message = "البيانات المرسلة فارغة" });

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var today = DateTime.Today;

                var mortalitiesJson = model.Mortalities != null && model.Mortalities.Any()
                    ? JsonConvert.SerializeObject(model.Mortalities.Select(m => new {
                        m.WarehouseMortality_ProductID,
                        m.WarehouseMortality_Quantity,
                        m.WarehouseMortality_Notes
                    }))
                    : null;

                var livestocksJson = model.Livestocks != null && model.Livestocks.Any()
                    ? JsonConvert.SerializeObject(model.Livestocks.Select(l => new {
                        l.WarehouseLivestock_ProductID,
                        l.WarehouseLivestock_Quantity,
                        l.WarehouseLivestock_Notes
                    }))
                    : null;

                var outgoingsJson = model.Outgoings != null && model.Outgoings.Any()
                    ? JsonConvert.SerializeObject(model.Outgoings.Select(o => new {
                        o.WarehouseOutgoing_DelegateName,
                        o.WarehouseOutgoing_ProductID,
                        o.WarehouseOutgoing_Quantity,
                        o.WarehouseOutgoing_Notes
                    }))
                    : null;

                var param = new DynamicParameters();
                param.Add("@UserId", userId);
                param.Add("@TargetDate", today);
                param.Add("@MortalitiesJson", mortalitiesJson);
                param.Add("@LivestocksJson", livestocksJson);
                param.Add("@OutgoingsJson", outgoingsJson);

                var movementId = _unitOfWork.SP_Call.OneRecord<int>("SP_SaveWarehouseMovement", param);

                return Json(new { success = true, message = "تم حفظ البيان بنجاح", movementId });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "حدث خطأ أثناء الحفظ: " + ex.Message });
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetMortalities()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var today = DateTime.Today;

                var movement = _unitOfWork.WarehouseMovement.GetFirstOrDefault
                    (m =>
                        m.WarehouseMovement_Date.Date == today &&
                        m.WarehouseMovement_UserID == userId &&
                        m.WarehouseMovement_Visible == "Yes");

                if (movement == null)
                    return Ok(new { success = true, data = new List<object>() });


                var mortalities = _unitOfWork.WarehouseMortality.GetAll
                    (m => m.WarehouseMortality_MovementID == movement.WarehouseMovement_ID &&
                                      m.WarehouseMortality_Visible == "Yes");

                var result = mortalities.Select(m => new
                {
                    id = m.WarehouseMortality_ID,
                    productId = m.WarehouseMortality_ProductID,
                    quantity = m.WarehouseMortality_Quantity,
                    notes = m.WarehouseMortality_Notes
                });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetLivestocks()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var today = DateTime.Today;

                var movement = _unitOfWork.WarehouseMovement
                    .GetFirstOrDefault(m =>
                        m.WarehouseMovement_Date.Date == today &&
                        m.WarehouseMovement_UserID == userId &&
                        m.WarehouseMovement_Visible == "Yes");

                if (movement == null)
                    return Ok(new { success = true, data = new List<object>() });

                var livestocks = _unitOfWork.WarehouseLivestock
                    .GetAll(l => l.WarehouseLivestock_MovementID == movement.WarehouseMovement_ID &&
                                      l.WarehouseLivestock_Visible == "Yes");

                var result = livestocks.Select(l => new
                {
                    id = l.WarehouseLivestock_ID,
                    productId = l.WarehouseLivestock_ProductID,
                    quantity = l.WarehouseLivestock_Quantity,
                    notes = l.WarehouseLivestock_Notes
                });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOutgoings()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var today = DateTime.Today;

                var movement = _unitOfWork.WarehouseMovement
                    .GetFirstOrDefault(m =>
                        m.WarehouseMovement_Date.Date == today &&
                        m.WarehouseMovement_UserID == userId &&
                        m.WarehouseMovement_Visible == "Yes");

                if (movement == null)
                    return Ok(new { success = true, data = new List<object>() });

                var outgoings = _unitOfWork.WarehouseOutgoing
                    .GetAll(o => o.WarehouseOutgoing_MovementID == movement.WarehouseMovement_ID &&
                                      o.WarehouseOutgoing_Visible == "Yes");

                var result = outgoings.Select(o => new
                {
                    id = o.WarehouseOutgoing_ID,
                    delegateName = o.WarehouseOutgoing_DelegateName,
                    productId = o.WarehouseOutgoing_ProductID,
                    quantity = o.WarehouseOutgoing_Quantity,
                    notes = o.WarehouseOutgoing_Notes
                });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }


    }
}