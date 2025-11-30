using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    // الخارج من المزرعة
    public class TblWarehouseOutgoing
    {
        [Key]
        public int WarehouseOutgoing_ID { get; set; }

        public int WarehouseOutgoing_MovementID { get; set; }

        public string WarehouseOutgoing_DelegateName { get; set; }

        public int WarehouseOutgoing_ProductID { get; set; }

        public int WarehouseOutgoing_Quantity { get; set; }

        public string? WarehouseOutgoing_Notes { get; set; }

        public string? WarehouseOutgoing_Visible { get; set; }

        public DateTime? WarehouseOutgoing_AddDate { get; set; }

        // Foreign Keys
        [ForeignKey("WarehouseOutgoing_MovementID")]
        public virtual TblWarehouseMovement WarehouseMovement { get; set; }

        [ForeignKey("WarehouseOutgoing_ProductID")]
        public virtual TblProduct Product { get; set; }
    }
}
