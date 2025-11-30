using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblDailyMovementCustomers
    {
        [Key]
        public int DailyMovementCustomer_ID { get; set; }
        public int? DailyMovementCustomer_MovementID { get; set; }
        public string? DailyMovementCustomer_CustomerName { get; set; }
        public int DailyMovementCustomer_CustomerID { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyMovementCustomer_Amount { get; set; }
        public string? DailyMovementCustomer_Notes { get; set; }
        public string? DailyMovementCustomer_Visible { get; set; }
        public string? DailyMovementCustomer_DeleteUserID { get; set; }
        public DateTime? DailyMovementCustomer_DeleteDate { get; set; }

        // Navigation Properties
        [ForeignKey("DailyMovementCustomer_MovementID")]
        public virtual TblDailyMovement DailyMovement { get; set; }

        //[ForeignKey("DailyMovementCustomer_CustomerID")]
        //public virtual TblCustomer Customer { get; set; }
    }
}
