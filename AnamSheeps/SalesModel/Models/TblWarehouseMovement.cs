using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblWarehouseMovement
    {
        [Key]
        public int WarehouseMovement_ID { get; set; }

        public DateTime WarehouseMovement_Date { get; set; }

        public string WarehouseMovement_UserID { get; set; }

        public string? WarehouseMovement_Visible { get; set; }

        public DateTime? WarehouseMovement_AddDate { get; set; }

        public DateTime? WarehouseMovement_EditDate { get; set; }

        // Navigation Properties
        public virtual ICollection<TblWarehouseMortality> WarehouseMortalities { get; set; }
        public virtual ICollection<TblWarehouseLivestock> WarehouseLivestocks { get; set; }
        public virtual ICollection<TblWarehouseOutgoing> WarehouseOutgoings { get; set; }
    }
}
