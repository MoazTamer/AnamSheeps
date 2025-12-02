using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementBalances
    {
        [Key]
        public int DailyMovementBalance_ID { get; set; }
        public int DailyMovementBalance_MovementID { get; set; }
        public string DailyMovementBalance_Type { get; set; } 
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementBalance_Amount { get; set; }
        public string? DailyMovementBalance_Notes { get; set; }
        public string? DailyMovementBalance_Visible { get; set; }
        public string? DailyMovementBalance_DeleteUserID { get; set; }
        public DateTime? DailyMovementBalance_DeleteDate { get; set; }

        // Navigation Properties
        [ForeignKey("DailyMovementBalance_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }
    }
}