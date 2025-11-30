using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.ViewModels
{
    public class ModelCustomer
    {
        public int Customer_ID { get; set; }
        public string Customer_Name { get; set; }
        public string? Customer_Phone { get; set; }
        public string? Customer_Address { get; set; }
    }
}
