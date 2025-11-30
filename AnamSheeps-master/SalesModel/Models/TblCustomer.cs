using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblCustomer
    {
        [Key]
        public int Customer_ID { get; set; }
        public string Customer_Name { get; set; }
        public string? Customer_Phone { get; set; }
        public string? Customer_Address { get; set; }
        public string? Customer_Visible { get; set; }
        public string? Customer_AddUserID { get; set; }
        public DateTime? Customer_AddDate { get; set; }
        public string? Customer_EditUserID { get; set; }
        public DateTime? Customer_EditDate { get; set; }
        public string? Customer_DeleteUserID { get; set; }
        public DateTime? Customer_DeleteDate { get; set; }
    }
}
