using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblExpense_Item
    {
        [Key]
        public int ExpenseItem_ID { get; set; }
        public string ExpenseItem_Name { get; set; }
        public string? ExpenseItem_Visible { get; set; }
        public string? ExpenseItem_AddUserID { get; set; }
        public DateTime? ExpenseItem_AddDate { get; set; }
        public string? ExpenseItem_EditUserID { get; set; }
        public DateTime? ExpenseItem_EditDate { get; set; }
        public string? ExpenseItem_DeleteUserID { get; set; }
        public DateTime? ExpenseItem_DeleteDate { get; set; }
    }
}
