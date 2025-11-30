using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    // الحلال الموجود
    public class TblWarehouseLivestock
    {
        [Key]
        public int WarehouseLivestock_ID { get; set; }

        public int WarehouseLivestock_MovementID { get; set; }

        public int WarehouseLivestock_ProductID { get; set; }

        public int WarehouseLivestock_Quantity { get; set; }

        public string? WarehouseLivestock_Notes { get; set; }

        public string? WarehouseLivestock_Visible { get; set; }

        public DateTime? WarehouseLivestock_AddDate { get; set; }

        // Foreign Keys
        [ForeignKey("WarehouseLivestock_MovementID")]
        public virtual TblWarehouseMovement WarehouseMovement { get; set; }

        [ForeignKey("WarehouseLivestock_ProductID")]
        public virtual TblProduct Product { get; set; }
    }
}
