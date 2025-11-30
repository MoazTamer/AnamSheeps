using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementSuppliers
    {
        [Key]
        public int DailyMovementSupplier_ID { get; set; }
        public int DailyMovementSupplier_MovementID { get; set; }
        public int? DailyMovementSupplier_SupplierID { get; set; }
        public string? DailyMovementSupplier_SupplierName { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementSupplier_Amount { get; set; }
        public string? DailyMovementSupplier_Notes { get; set; }
        public string? DailyMovementSupplier_Visible { get; set; }
        public string? DailyMovementSupplier_DeleteUserID { get; set; }
        public DateTime? DailyMovementSupplier_DeleteDate { get; set; }

        // Navigation Properties
        [ForeignKey("DailyMovementSupplier_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }

        [ForeignKey("DailyMovementSupplier_SupplierID")]
        public virtual TblSupplier Supplier { get; set; }
    }
}
