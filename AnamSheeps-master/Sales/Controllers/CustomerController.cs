using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;

namespace Sales.Controllers
{
    public class CustomerController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthorizationService _authorizationService;
        string Title = "العملاء";

        public CustomerController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, IAuthorizationService authorizationService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        [Authorize(Policy = "Customer_View")]
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
        public IActionResult GetCustomer()
        {
            try
            {
                var customers = _unitOfWork.Customer
                    .GetAll(obj => obj.Customer_Visible == "yes");

                return Json(new { data = customers });
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message, stack = ex.StackTrace });
            }
        }
        [HttpGet]
        public IActionResult Create()
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Customer_Create").Result).Succeeded)
                {
                    return PartialView("_AuthorizedAdd");
                }
                return PartialView("_CustomerCreate", new ModelCustomer());
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
        public async Task<IActionResult> Create(ModelCustomer modelCustomer)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Customer_Create").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkCustomer = _unitOfWork.Customer.GetFirstOrDefault(obj => obj.Customer_Name == modelCustomer.Customer_Name.Trim() && obj.Customer_Visible == "yes");
                if (checkCustomer != null)
                {
                    return Json(new { isValid = false, title = Title, message = "العميل موجود بالفعل" });
                }

                var customer = new TblCustomer
                {
                    Customer_Name = modelCustomer.Customer_Name.Trim(),
                    Customer_Phone = modelCustomer.Customer_Phone?.Trim(),
                    Customer_Address = modelCustomer.Customer_Address?.Trim(),
                    Customer_Visible = "yes",
                    Customer_AddUserID = _userManager.GetUserId(User),
                    Customer_AddDate = DateTime.Now
                };
                _unitOfWork.Customer.Add(customer);

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = customer });
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
                if (!(_authorizationService.AuthorizeAsync(User, "Customer_Edit").Result).Succeeded)
                {
                    return PartialView("_AuthorizedEdit");
                }
                var customer = _unitOfWork.Customer.GetById(id);
                if (customer == null)
                {
                    ViewBag.Type = "error";
                    ViewBag.Message = "العميل غير موجود";
                    return View();
                }
                var model = new ModelCustomer
                {
                    Customer_ID = customer.Customer_ID,
                    Customer_Name = customer.Customer_Name,
                    Customer_Phone = customer.Customer_Phone,
                    Customer_Address = customer.Customer_Address
                };
                return PartialView("_CustomerEdit", model);
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
        public async Task<IActionResult> Edit(ModelCustomer modelCustomer)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Customer_Edit").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkCustomer = _unitOfWork.Customer.GetFirstOrDefault(obj => obj.Customer_ID != modelCustomer.Customer_ID && obj.Customer_Name == modelCustomer.Customer_Name.Trim() && obj.Customer_Visible == "yes");
                if (checkCustomer != null)
                {
                    return Json(new { isValid = false, title = Title, message = "العميل موجود بالفعل" });
                }

                var customer = _unitOfWork.Customer.GetById(modelCustomer.Customer_ID);
                customer.Customer_Name = modelCustomer.Customer_Name.Trim();
                customer.Customer_Phone = modelCustomer.Customer_Phone?.Trim();
                customer.Customer_Address = modelCustomer.Customer_Address?.Trim();
                customer.Customer_EditUserID = _userManager.GetUserId(User);
                customer.Customer_EditDate = DateTime.Now;

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = customer });
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
                if (!(_authorizationService.AuthorizeAsync(User, "Customer_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var customer = _unitOfWork.Customer.GetById(id);
                customer.Customer_Visible = "no";
                customer.Customer_DeleteUserID = _userManager.GetUserId(User);
                customer.Customer_DeleteDate = DateTime.Now;

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

        [Authorize(Policy = "Customer_Delete")]
        [HttpPost]
        public async Task<IActionResult> DeleteRange(List<string> lstId)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Customer_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }
                string firstList = lstId[0].ToString();
                string[] lst = firstList.Split(",");
                await _unitOfWork.Customer.UpdateAll(obj => lst.Contains(obj.Customer_ID.ToString()), obj => obj.SetProperty(obj => obj.Customer_Visible, "no"));
                await _unitOfWork.Customer.UpdateAll(obj => lst.Contains(obj.Customer_ID.ToString()), obj => obj.SetProperty(obj => obj.Customer_DeleteUserID, _userManager.GetUserId(User)));
                await _unitOfWork.Customer.UpdateAll(obj => lst.Contains(obj.Customer_ID.ToString()), obj => obj.SetProperty(obj => obj.Customer_DeleteDate, DateTime.Now));
                return Json(new { isValid = true, title = Title, message = "تم الحذف بنجاح" });
            }
            catch (Exception)
            {
                return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من البيانات" });
            }
        }
    }
}