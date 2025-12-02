using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class oldTblDailyMovementWithdrawals
    {
        [Key]
        public int DailyMovementWithdrawal_ID { get; set; }
        public int DailyMovementWithdrawal_MovementID { get; set; }
        public string DailyMovementWithdrawal_Type { get; set; } 
        public string? DailyMovementWithdrawal_Receiver { get; set; } 
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementWithdrawal_Amount { get; set; }
        public string? DailyMovementWithdrawal_Notes { get; set; }
        public string? DailyMovementWithdrawal_Visible { get; set; }
        public string? DailyMovementWithdrawal_DeleteUserID { get; set; }
        public DateTime? DailyMovementWithdrawal_DeleteDate { get; set; }

        // Navigation Properties
        [ForeignKey("DailyMovementWithdrawal_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }
    }

}
