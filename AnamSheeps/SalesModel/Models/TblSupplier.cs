using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblSupplier
    {
        [Key]
        public int Supplier_ID { get; set; }
        public string Supplier_Name { get; set; }
        public string? Supplier_Phone { get; set; }
        public string? Supplier_Address { get; set; }
        public string? Supplier_Visible { get; set; }
        public string? Supplier_AddUserID { get; set; }
        public DateTime? Supplier_AddDate { get; set; }
        public string? Supplier_EditUserID { get; set; }
        public DateTime? Supplier_EditDate { get; set; }
        public string? Supplier_DeleteUserID { get; set; }
        public DateTime? Supplier_DeleteDate { get; set; }
    }
}
