using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    // النفوق والمستهلك
    public class TblWarehouseMortality
    {
        [Key]
        public int WarehouseMortality_ID { get; set; }

        public int WarehouseMortality_MovementID { get; set; }

        public int WarehouseMortality_ProductID { get; set; }

        public int WarehouseMortality_Quantity { get; set; }

        public string? WarehouseMortality_Notes { get; set; }

        public string? WarehouseMortality_Visible { get; set; }

        public DateTime? WarehouseMortality_AddDate { get; set; }

        // Foreign Keys
        [ForeignKey("WarehouseMortality_MovementID")]
        public virtual TblWarehouseMovement WarehouseMovement { get; set; }

        [ForeignKey("WarehouseMortality_ProductID")]
        public virtual TblProduct Product { get; set; }
    }
    public class ModelWarehouseMortality
    {
        public int WarehouseMortality_ID { get; set; }
        public int WarehouseMortality_ProductID { get; set; }
        public int WarehouseMortality_Quantity { get; set; }
        public string WarehouseMortality_Notes { get; set; }
        public string Product_Name { get; set; }
        public int WarehouseMortality_MovementID { get; set; }
    }
}
