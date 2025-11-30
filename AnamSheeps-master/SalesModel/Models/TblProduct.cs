using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.Models
{
    public class TblProduct
    {
        [Key]
        public int Product_ID { get; set; }
        public string Product_Name { get; set; }
        public string? Product_Code { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Product_Price { get; set; }
        public int? Product_CategoryID { get; set; }
        public string? Product_Description { get; set; }
        public string? Product_Visible { get; set; }
        public string? Product_AddUserID { get; set; }
        public DateTime? Product_AddDate { get; set; }
        public string? Product_EditUserID { get; set; }
        public DateTime? Product_EditDate { get; set; }
        public string? Product_DeleteUserID { get; set; }
        public DateTime? Product_DeleteDate { get; set; }

        [ForeignKey("Product_CategoryID")]
        public virtual TblProduct_Category? ProductCategory { get; set; }
    }
}
