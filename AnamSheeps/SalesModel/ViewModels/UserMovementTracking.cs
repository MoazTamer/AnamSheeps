using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesModel.ViewModels
{
    public class UserMovementTracking
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; } // مندوب أو أمين مستودع
        public DateTime MovementDate { get; set; }
        public bool HasMovement { get; set; } // هل أدخل بيان اليوم؟
        public int MovementId { get; set; }
        public DateTime? LastUpdateDate { get; set; }
        public decimal? LastBalance { get; set; }

        // للمندوبين
        public decimal TotalPurchases { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal AvailableBalance { get; set; }

        // لأمناء المستودعات
        public int TotalMortality { get; set; } // النفوق
        public int TotalLivestock { get; set; } // الحلال الموجود
        public int TotalOutgoing { get; set; } // الخارج من المزرعة

        // حالة البيان
        public string StatusBadge => HasMovement ? "success" : "danger";
        public string StatusText => HasMovement ? "تم الإدخال" : "لم يتم الإدخال";
        public string StatusIcon => HasMovement ? "ki-check-circle" : "ki-close-circle";
    }
}
