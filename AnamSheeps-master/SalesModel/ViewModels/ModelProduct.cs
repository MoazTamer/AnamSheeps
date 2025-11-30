using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.ViewModels
{
    public class ModelProduct
    {
        public int Product_ID { get; set; }
        public string Product_Name { get; set; }
        public string? Product_Code { get; set; }
        public decimal? Product_Price { get; set; }
        public int? Product_CategoryID { get; set; }
        public string? Product_CategoryName { get; set; }
        public string? Product_Description { get; set; }
    }
}
