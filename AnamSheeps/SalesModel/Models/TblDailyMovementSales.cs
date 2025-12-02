using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementSales
    {
        [Key]
        public int DailyMovementSales_ID { get; set; }
        public int DailyMovementSales_MovementID { get; set; }
        public int DailyMovementSales_ProductID { get; set; }
        public int DailyMovementSales_Quantity { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementSales_Price { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementSales_Total { get; set; }
        public string DailyMovementSales_PaymentType { get; set; } // "آجل" or "نقدا"
        public string? DailyMovementSales_Notes { get; set; }
        public string? DailyMovementSales_Visible { get; set; }
        public string? DailyMovementSales_DeleteUserID { get; set; }
        public DateTime? DailyMovementSales_DeleteDate { get; set; }

        // Navigation Properties
        [ForeignKey("DailyMovementSales_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }

        [ForeignKey("DailyMovementSales_ProductID")]
        public virtual TblProduct Product { get; set; }
    }
}
