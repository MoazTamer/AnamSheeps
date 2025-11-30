using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementExpenses
    {
        [Key]
        public int DailyMovementExpense_ID { get; set; }
        public int DailyMovementExpense_MovementID { get; set; }
        public int? DailyMovementExpense_CategoryID { get; set; }
        public string? DailyMovementExpense_CategoryName { get; set; }

        public int DailyMovementExpense_Quantity { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementExpense_Amount { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementExpense_Total { get; set; }
        public string? DailyMovementExpense_Notes { get; set; }
        public string? DailyMovementExpense_Visible { get; set; }
        public string? DailyMovementExpense_DeleteUserID { get; set; }
        public DateTime? DailyMovementExpense_DeleteDate { get; set; }

        // Navigation Properties
        [ForeignKey("DailyMovementExpense_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }

        [ForeignKey("DailyMovementExpense_CategoryID")]
        public virtual TblExpense_Item ExpenseItem { get; set; }
    }
}
