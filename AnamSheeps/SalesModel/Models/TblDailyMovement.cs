using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
   public class TblDailyMovement
        {
            [Key]
            public int DailyMovement_ID { get; set; }
            public DateTime DailyMovement_Date { get; set; }
            public string DailyMovement_UserID { get; set; }
            public string? DailyMovement_Visible { get; set; }
            public DateTime? DailyMovement_AddDate { get; set; }
            public DateTime? DailyMovement_EditDate { get; set; }
            [Column(TypeName = "decimal(18,2)")]
            public decimal DailyMovement_FinalBalance { get; set; }


        // Navigation Property
        public virtual ICollection<TblDailyMovementDetails> DailyMovementDetails { get; set; }
            public virtual ICollection<TblDailyMovementSales> DailyMovementSales { get; set; }
            public virtual ICollection<TblDailyMovementExpenses> DailyMovementExpenses { get; set; }
            public virtual ICollection<TblDailyMovementSuppliers> DailyMovementSuppliers { get; set; }
            public virtual ICollection<TblDailyMovementCustomers> DailyMovementCustomers { get; set; }
            //public virtual ICollection<oldTblDailyMovementWithdrawals> DailyMovementWithdrawals { get; set; }
            public virtual ICollection<TblDailyMovementTaslim> DailyMovementTaslim { get; set; }
            public virtual ICollection<TblDailyMovementWarid> DailyMovementWarid { get; set; }

        public virtual ICollection<TblDailyMovementBalances> DailyMovementBalances { get; set; }

    }
}

