using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementWarid
    {
        [Key]
        public int DailyMovementWarid_ID { get; set; }

        public int DailyMovementWarid_MovementID { get; set; }

        public string DailyMovementWarid_Receiver { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementWarid_Amount { get; set; }

        public string? DailyMovementWarid_Notes { get; set; }
        public string? DailyMovementWarid_Visible { get; set; }
        public DateTime? DailyMovementWarid_AddDate { get; set; }
        public DateTime? DailyMovementWarid_EditDate { get; set; }
        public string? DailyMovementWarid_DeleteUserID { get; set; }
        public DateTime? DailyMovementWarid_DeleteDate { get; set; }

        [ForeignKey("DailyMovementWarid_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }
    }
}
