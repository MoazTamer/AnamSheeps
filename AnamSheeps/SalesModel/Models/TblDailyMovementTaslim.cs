using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementTaslim
    {
        [Key]
        public int DailyMovementTaslim_ID { get; set; }

        public int DailyMovementTaslim_MovementID { get; set; }

        public string DailyMovementTaslim_Receiver { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementTaslim_Amount { get; set; }

        public string? DailyMovementTaslim_Notes { get; set; }
        public string? DailyMovementTaslim_Visible { get; set; }
        public DateTime? DailyMovementTaslim_AddDate { get; set; }
        public DateTime? DailyMovementTaslim_EditDate { get; set; }
        public string? DailyMovementTaslim_DeleteUserID { get; set; }
        public DateTime? DailyMovementTaslim_DeleteDate { get; set; }

        [ForeignKey("DailyMovementTaslim_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }
    }
}
