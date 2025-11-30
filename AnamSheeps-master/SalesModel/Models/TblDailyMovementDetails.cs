using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementDetails
    {
        [Key]
        public int DailyMovementDetails_ID { get; set; }
        public int DailyMovementDetails_MovementID { get; set; }
        public int DailyMovementDetails_ProductID { get; set; }
        public int DailyMovementDetails_Quantity { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementDetails_Price { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementDetails_Total { get; set; }
        public string DailyMovementDetails_PaymentType { get; set; } // "آجل" or "نقدا"
        public string? DailyMovementDetails_Notes { get; set; }
        public string? DailyMovementDetails_Visible { get; set; }
        public string? DailyMovementDetails_DeleteUserID { get; set; }
        public DateTime? DailyMovementDetails_DeleteDate { get; set; }

        // Navigation Properties
        [ForeignKey("DailyMovementDetails_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }

        [ForeignKey("DailyMovementDetails_ProductID")]
        public virtual TblProduct Product { get; set; }
    }
}
