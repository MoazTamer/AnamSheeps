using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;
using System.Threading.Tasks;

namespace Sales.Controllers
{
    public class Expense_ItemController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthorizationService _authorizationService;
        string Title = "بنود المصروفات";

        public Expense_ItemController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, IAuthorizationService authorizationService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        [Authorize(Policy = "ExpenseItem_View")]
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

        //[HttpGet]
        //public IActionResult GetExpenseItems()
        //{
        //    var expenseItems = _unitOfWork.Expense_Item.GetAll(obj => obj.ExpenseItem_Visible == "yes");
        //    return Json(new { data = expenseItems });
        //}

        [HttpGet]
        public IActionResult GetExpenseItems()
        {
            try
            {
                var expenseItems = _unitOfWork.Expense_Item
                    .GetAll(obj => obj.ExpenseItem_Visible == "yes");

                return Json(new { data = expenseItems });
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
                if (!(_authorizationService.AuthorizeAsync(User, "ExpenseItem_Create").Result).Succeeded)
                {
                    return PartialView("_AuthorizedAdd");
                }
                return PartialView("_Expense_ItemCreate", new ModelExpense_Item());
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
        public async Task<IActionResult> Create(ModelExpense_Item modelExpense_Item)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "ExpenseItem_Create").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkExpenseItem = _unitOfWork.Expense_Item.GetFirstOrDefault(obj =>
                    obj.ExpenseItem_Name == modelExpense_Item.ExpenseItem_Name.Trim() &&
                    obj.ExpenseItem_Visible == "yes");

                if (checkExpenseItem != null)
                {
                    return Json(new { isValid = false, title = Title, message = "بند المصروف موجود بالفعل" });
                }

                var expenseItem = new TblExpense_Item
                {
                    ExpenseItem_Name = modelExpense_Item.ExpenseItem_Name.Trim(),
                    ExpenseItem_Visible = "yes",
                    ExpenseItem_AddUserID = _userManager.GetUserId(User),
                    ExpenseItem_AddDate = DateTime.Now
                };

                _unitOfWork.Expense_Item.Add(expenseItem);

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = expenseItem });
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
                if (!(_authorizationService.AuthorizeAsync(User, "ExpenseItem_Edit").Result).Succeeded)
                {
                    return PartialView("_AuthorizedEdit");
                }

                var expenseItem = _unitOfWork.Expense_Item.GetById(id);
                if (expenseItem == null)
                {
                    ViewBag.Type = "error";
                    ViewBag.Message = "بند المصروف غير موجود";
                    return View();
                }

                var model = new ModelExpense_Item
                {
                    ExpenseItem_ID = expenseItem.ExpenseItem_ID,
                    ExpenseItem_Name = expenseItem.ExpenseItem_Name
                };

                return PartialView("_Expense_ItemEdit", model);
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
        public async Task<IActionResult> Edit(ModelExpense_Item modelExpense_Item)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "ExpenseItem_Edit").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkExpenseItem = _unitOfWork.Expense_Item.GetFirstOrDefault(obj =>
                    obj.ExpenseItem_ID != modelExpense_Item.ExpenseItem_ID &&
                    obj.ExpenseItem_Name == modelExpense_Item.ExpenseItem_Name.Trim() &&
                    obj.ExpenseItem_Visible == "yes");

                if (checkExpenseItem != null)
                {
                    return Json(new { isValid = false, title = Title, message = "بند المصروف موجود بالفعل" });
                }

                var expenseItem = _unitOfWork.Expense_Item.GetById(modelExpense_Item.ExpenseItem_ID);
                expenseItem.ExpenseItem_Name = modelExpense_Item.ExpenseItem_Name.Trim();
                expenseItem.ExpenseItem_EditUserID = _userManager.GetUserId(User);
                expenseItem.ExpenseItem_EditDate = DateTime.Now;

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = expenseItem });
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
                if (!(_authorizationService.AuthorizeAsync(User, "ExpenseItem_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var expenseItem = _unitOfWork.Expense_Item.GetById(id);
                expenseItem.ExpenseItem_Visible = "no";
                expenseItem.ExpenseItem_DeleteUserID = _userManager.GetUserId(User);
                expenseItem.ExpenseItem_DeleteDate = DateTime.Now;

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

        [Authorize(Policy = "ExpenseItem_Delete")]
        [HttpPost]
        public async Task<IActionResult> DeleteRange(List<string> lstId)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "ExpenseItem_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                string firstList = lstId[0].ToString();
                string[] lst = firstList.Split(",");

                await _unitOfWork.Expense_Item.UpdateAll(obj => lst.Contains(obj.ExpenseItem_ID.ToString()),
                    obj => obj.SetProperty(obj => obj.ExpenseItem_Visible, "no"));

                await _unitOfWork.Expense_Item.UpdateAll(obj => lst.Contains(obj.ExpenseItem_ID.ToString()),
                    obj => obj.SetProperty(obj => obj.ExpenseItem_DeleteUserID, _userManager.GetUserId(User)));

                await _unitOfWork.Expense_Item.UpdateAll(obj => lst.Contains(obj.ExpenseItem_ID.ToString()),
                    obj => obj.SetProperty(obj => obj.ExpenseItem_DeleteDate, DateTime.Now));

                return Json(new { isValid = true, title = Title, message = "تم الحذف بنجاح" });
            }
            catch (Exception)
            {
                return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من البيانات" });
            }
        }
    }
}