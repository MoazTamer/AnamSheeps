using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;

namespace Sales.Controllers
{
    public class ProductController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthorizationService _authorizationService;
        string Title = "الأصناف";

        public ProductController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, IAuthorizationService authorizationService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        [Authorize(Policy = "Product_View")]
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
        public IActionResult GetProduct()
        {
            var products = _unitOfWork.Product.GetAll(
                obj => obj.Product_Visible == "yes",
                includeProperties:new string[] { "ProductCategory" }
            ).Select(p => new
            {
                product_ID = p.Product_ID,
                product_Name = p.Product_Name,
                product_Code = p.Product_Code,
                product_Price = p.Product_Price,
                product_CategoryID = p.Product_CategoryID,
                productCategory_Name = p.ProductCategory != null ? p.ProductCategory.ProductCategory_Name : ""
            });

            return Json(new { data = products });
        }

        [HttpGet]
        public IActionResult Create()
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Product_Create").Result).Succeeded)
                {
                    return PartialView("_AuthorizedAdd");
                }

                ViewBag.Categories = _unitOfWork.Product_Category.GetAll(obj => obj.ProductCategory_Visible == "yes");
                return PartialView("_ProductCreate", new ModelProduct());
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
        public async Task<IActionResult> Create(ModelProduct modelProduct)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Product_Create").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkProduct = _unitOfWork.Product.GetFirstOrDefault(obj => obj.Product_Name == modelProduct.Product_Name.Trim() && obj.Product_Visible == "yes");
                if (checkProduct != null)
                {
                    return Json(new { isValid = false, title = Title, message = "الصنف موجود بالفعل" });
                }

                var product = new TblProduct
                {
                    Product_Name = modelProduct.Product_Name.Trim(),
                    Product_Code = modelProduct.Product_Code?.Trim(),
                    Product_Price = modelProduct.Product_Price,
                    Product_CategoryID = modelProduct.Product_CategoryID,
                    Product_Description = modelProduct.Product_Description?.Trim(),
                    Product_Visible = "yes",
                    Product_AddUserID = _userManager.GetUserId(User),
                    Product_AddDate = DateTime.Now
                };
                _unitOfWork.Product.Add(product);

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                var category = _unitOfWork.Product_Category.GetById(product.Product_CategoryID ?? 0);
                var result = new
                {
                    product_ID = product.Product_ID,
                    product_Name = product.Product_Name,
                    product_Code = product.Product_Code,
                    product_Price = product.Product_Price,
                    product_CategoryID = product.Product_CategoryID,
                    productCategory_Name = category?.ProductCategory_Name ?? ""
                };

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = result });
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
                if (!(_authorizationService.AuthorizeAsync(User, "Product_Edit").Result).Succeeded)
                {
                    return PartialView("_AuthorizedEdit");
                }

                var product = _unitOfWork.Product.GetById(id);
                if (product == null)
                {
                    ViewBag.Type = "error";
                    ViewBag.Message = "الصنف غير موجود";
                    return View();
                }

                ViewBag.Categories = _unitOfWork.Product_Category.GetAll(obj => obj.ProductCategory_Visible == "yes");

                var model = new ModelProduct
                {
                    Product_ID = product.Product_ID,
                    Product_Name = product.Product_Name,
                    Product_Code = product.Product_Code,
                    Product_Price = product.Product_Price,
                    Product_CategoryID = product.Product_CategoryID,
                    Product_Description = product.Product_Description
                };
                return PartialView("_ProductEdit", model);
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
        public async Task<IActionResult> Edit(ModelProduct modelProduct)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Product_Edit").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var checkProduct = _unitOfWork.Product.GetFirstOrDefault(obj => obj.Product_ID != modelProduct.Product_ID && obj.Product_Name == modelProduct.Product_Name.Trim() && obj.Product_Visible == "yes");
                if (checkProduct != null)
                {
                    return Json(new { isValid = false, title = Title, message = "الصنف موجود بالفعل" });
                }

                var product = _unitOfWork.Product.GetById(modelProduct.Product_ID);
                product.Product_Name = modelProduct.Product_Name.Trim();
                product.Product_Code = modelProduct.Product_Code?.Trim();
                product.Product_Price = modelProduct.Product_Price;
                product.Product_CategoryID = modelProduct.Product_CategoryID;
                product.Product_Description = modelProduct.Product_Description?.Trim();
                product.Product_EditUserID = _userManager.GetUserId(User);
                product.Product_EditDate = DateTime.Now;

                if (await _unitOfWork.Complete() == 0)
                {
                    return Json(new { isValid = false, title = Title, message = "لم يتم حفظ البيانات" });
                }

                var category = _unitOfWork.Product_Category.GetById(product.Product_CategoryID ?? 0);
                var result = new
                {
                    product_ID = product.Product_ID,
                    product_Name = product.Product_Name,
                    product_Code = product.Product_Code,
                    product_Price = product.Product_Price,
                    product_CategoryID = product.Product_CategoryID,
                    productCategory_Name = category?.ProductCategory_Name ?? ""
                };

                return Json(new { isValid = true, title = Title, message = "تم الحفظ بنجاح", data = result });
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
                if (!(_authorizationService.AuthorizeAsync(User, "Product_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }

                var product = _unitOfWork.Product.GetById(id);
                product.Product_Visible = "no";
                product.Product_DeleteUserID = _userManager.GetUserId(User);
                product.Product_DeleteDate = DateTime.Now;

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

        [Authorize(Policy = "Product_Delete")]
        [HttpPost]
        public async Task<IActionResult> DeleteRange(List<string> lstId)
        {
            try
            {
                if (!(_authorizationService.AuthorizeAsync(User, "Product_Delete").Result).Succeeded)
                {
                    return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من وجود صلاحية لفتح هذة النافذة" });
                }
                string firstList = lstId[0].ToString();
                string[] lst = firstList.Split(",");
                await _unitOfWork.Product.UpdateAll(obj => lst.Contains(obj.Product_ID.ToString()), obj => obj.SetProperty(obj => obj.Product_Visible, "no"));
                await _unitOfWork.Product.UpdateAll(obj => lst.Contains(obj.Product_ID.ToString()), obj => obj.SetProperty(obj => obj.Product_DeleteUserID, _userManager.GetUserId(User)));
                await _unitOfWork.Product.UpdateAll(obj => lst.Contains(obj.Product_ID.ToString()), obj => obj.SetProperty(obj => obj.Product_DeleteDate, DateTime.Now));
                return Json(new { isValid = true, title = Title, message = "تم الحذف بنجاح" });
            }
            catch (Exception)
            {
                return Json(new { isValid = false, title = Title, message = "من فضلك تأكد من البيانات" });
            }
        }
    }
}
