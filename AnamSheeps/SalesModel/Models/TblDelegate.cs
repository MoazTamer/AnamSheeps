using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDelegate
    {
        [Key]
        public int Delegate_ID { get; set; }

        [Required]
        public string Delegate_Name { get; set; }

        public string? Delegate_Phone { get; set; }

        public string? Delegate_Address { get; set; }

        // ربط مع ApplicationUser
        public string? Delegate_UserID { get; set; }

        public string? Delegate_Visible { get; set; }

        public string? Delegate_AddUserID { get; set; }

        public DateTime? Delegate_AddDate { get; set; }

        public string? Delegate_EditUserID { get; set; }

        public DateTime? Delegate_EditDate { get; set; }

        public string? Delegate_DeleteUserID { get; set; }

        public DateTime? Delegate_DeleteDate { get; set; }
    }
}
