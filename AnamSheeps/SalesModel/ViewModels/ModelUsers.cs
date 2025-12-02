using Microsoft.AspNetCore.Mvc.Rendering;
using SalesModel.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesModel.ViewModels
{
    public class ModelUsers
	{
        public string Id { get; set; }
        public int BranchID { get; set; }
        public string Branch_Name { get; set; }
        public string BranchName { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; } // "مندوب", "أمين مستودع", "إدارة"
        public string Password { get; set; }
        public string Visible { get; set; }

		public IEnumerable<SelectListItem> BranchList { get; set; }

        public IEnumerable<SelectListItem> UserTypeList { get; set; }
    }
}
