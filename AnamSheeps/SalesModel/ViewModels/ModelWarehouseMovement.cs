using SalesModel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.ViewModels
{
    public class ModelWarehouseMovement
    {
        public int WarehouseMovement_ID { get; set; }
        public DateTime WarehouseMovement_Date { get; set; }
        public string WarehouseMovement_UserID { get; set; }

        // النفوق والمستهلك
        public List<TblWarehouseMortality> Mortalities { get; set; } = new List<TblWarehouseMortality>();

        // الحلال الموجود
        public List<TblWarehouseLivestock> Livestocks { get; set; } = new List<TblWarehouseLivestock>();

        // الخارج من المزرعة
        public List<TblWarehouseOutgoing> Outgoings { get; set; } = new List<TblWarehouseOutgoing>();
    }
}
