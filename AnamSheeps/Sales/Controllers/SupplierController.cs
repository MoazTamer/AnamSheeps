using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;

namespace Sales.Controllers
{
    public class SupplierController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthorizationService _authorizationService;
        string Title = "الموردين";

        public SupplierController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, IAuthorizationService authorizationService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        [Authorize(Policy = "Supplier_View")]
        [HttpGet]
        public IActionResult Index()
        {
            try
            {
                return View();
            }
            catch (Exception)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "من فضلك تأكد من البيانات";
                return View();
            }
        }

        [HttpGet]
        public IActionResult GetSupplier()
        {
            var suppliers = _unitOfWork.Supplier.GetAll(obj => obj.Supplier_Visible == "yes");
            return Json(new { data = suppliers });
        }

        [HttpGet]
        public IActionResult Create()
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Supplier_Create").Result).Succeeded)
                {
                    return PartialView("_AuthorizedAdd");
                }
                return PartialView("_SupplierCreate", new ModelSupplier());
            }
            catch (Exception)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "من فضلك تأكد من البيانات";
                return View();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ModelSupplier modelSupplier)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Supplier_Create").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkSupplier = _unitOfWork.Supplier.GetFirstOrDefault(obj => obj.Supplier_Name == modelSupplier.Supplier_Name.Trim() && obj.Supplier_Visible == "yes");
                if (checkSupplier != null)
                {
                    return Json(new { isValid = false, title = Title, message = "المورد موجود بالفعل" });
                }

                var supplier = new TblSupplier
                {
                    Supplier_Name = modelSupplier.Supplier_Name.Trim(),
                    Supplier_Phone = modelSupplier.Supplier_Phone?.Trim(),
                    Supplier_Address = modelSupplier.Supplier_Address?.Trim(),
                    Supplier_Visible = "yes",
                    Supplier_AddUserID = _userManager.GetUserId(User),
                    Supplier_AddDate = DateTime.Now
                };
                _unitOfWork.Supplier.Add(supplier);

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = supplier });
            }
            catch (Exception)
            {
                return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من البيانات" });
            }
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Supplier_Edit").Result).Succeeded)
                {
                    return PartialView("_AuthorizedEdit");
                }
                var supplier = _unitOfWork.Supplier.GetById(id);
                if (supplier == null)
                {
                    ViewBag.Type = "error";
                    ViewBag.Message = "المورد غير موجود";
                    return View();
                }
                var model = new ModelSupplier
                {
                    Supplier_ID = supplier.Supplier_ID,
                    Supplier_Name = supplier.Supplier_Name,
                    Supplier_Phone = supplier.Supplier_Phone,
                    Supplier_Address = supplier.Supplier_Address
                };
                return PartialView("_SupplierEdit", model);
            }
            catch (Exception)
            {
                ViewBag.Type = "error";
                ViewBag.Message = "من فضلك تأكد من البيانات";
                return View();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(ModelSupplier modelSupplier)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Supplier_Edit").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkSupplier = _unitOfWork.Supplier.GetFirstOrDefault(obj => obj.Supplier_ID != modelSupplier.Supplier_ID && obj.Supplier_Name == modelSupplier.Supplier_Name.Trim() && obj.Supplier_Visible == "yes");
                if (checkSupplier != null)
                {
                    return Json(new { isValid = false, title = Title, message = "المورد موجود بالفعل" });
                }

                var supplier = _unitOfWork.Supplier.GetById(modelSupplier.Supplier_ID);
                supplier.Supplier_Name = modelSupplier.Supplier_Name.Trim();
                supplier.Supplier_Phone = modelSupplier.Supplier_Phone?.Trim();
                supplier.Supplier_Address = modelSupplier.Supplier_Address?.Trim();
                supplier.Supplier_EditUserID = _userManager.GetUserId(User);
                supplier.Supplier_EditDate = DateTime.Now;

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = supplier });
            }
            catch (Exception)
            {
                return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من البيانات" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Supplier_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var supplier = _unitOfWork.Supplier.GetById(id);
                supplier.Supplier_Visible = "no";
                supplier.Supplier_DeleteUserID = _userManager.GetUserId(User);
                supplier.Supplier_DeleteDate = DateTime.Now;

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "عفوا ، لم يتم الحذف" });
                }

                return Json(new { isValid = true, title = Title, message = "تم الحذف بنجاح" });
            }
            catch (Exception)
            {
                return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من البيانات" });
            }
        }

        [Authorize(Policy = "Supplier_Delete")]
        [HttpPost]
        public async Task<IActionResult> DeleteRange(List<string> lstId)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Supplier_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }
                string firstList = lstId[0].ToString();
                string[] lst = firstList.Split(",");
                await _unitOfWork.Supplier.UpdateAll(obj => lst.Contains(obj.Supplier_ID.ToString()), obj => obj.SetProperty(obj => obj.Supplier_Visible, "no"));
                await _unitOfWork.Supplier.UpdateAll(obj => lst.Contains(obj.Supplier_ID.ToString()), obj => obj.SetProperty(obj => obj.Supplier_DeleteUserID, _userManager.GetUserId(User)));
                await _unitOfWork.Supplier.UpdateAll(obj => lst.Contains(obj.Supplier_ID.ToString()), obj => obj.SetProperty(obj => obj.Supplier_DeleteDate, DateTime.Now));
                return Json(new { isValid = true, title = Title, message = "تم الحذف بنجاح" });
            }
            catch (Exception)
            {
                return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من البيانات" });
            }
        }
    }
}
