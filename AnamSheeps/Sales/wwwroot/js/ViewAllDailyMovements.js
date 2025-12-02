// إعدادات DataTable الأساسية
const dataTableConfig = {
    responsive: true,
    processing: true,
    searching: false,
    paging: false,
    info: false,
    "language": {
        "emptyTable": "لا توجد بيانات",
        "loadingRecords": "جارى التحميل ...",
        "processing": "جارى التحميل ...",
        "zeroRecords": "لا توجد مدخلات مطابقة للبحث"
    },
    'order': [],
    fixedHeader: {
        header: true
    }
};

// تهيئة جميع الجداول عند تحميل الصفحة
$(document).ready(function () {
    initializeAllTables();
});

// تهيئة جميع الجداول
function initializeAllTables() {
    // تفاصيل المشتريات
    $('.details-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeDetailsTable(this, movementId);
    });

    // المبيعات
    $('.sales-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeSalesTable(this, movementId);
    });

    // المصروفات
    $('.expenses-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeExpensesTable(this, movementId);
    });

    // الموردين
    $('.suppliers-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeSuppliersTable(this, movementId);
    });

    // العملاء
    $('.customers-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeCustomersTable(this, movementId);
    });

    // التسليم
    $('.taslim-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeTaslimTable(this, movementId);
    });

    // الوارد
    $('.warid-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeWaridTable(this, movementId);
    });

    // الأرصدة
    $('.balances-table').each(function () {
        const movementId = $(this).closest('[data-movement-id]').data('movement-id');
        initializeBalancesTable(this, movementId);
    });

    // النفوق
    $('.mortality-table').each(function () {
        const section = $(this).closest('[data-movement-id]');
        const movementId = section.data('movement-id');
        const userId = section.data('user-id');
        initializeMortalityTable(this, movementId, userId);
    });
}

// 1. تفاصيل المشتريات
function initializeDetailsTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementDetails?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    // إخفاء القسم إذا لا توجد بيانات
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.details-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No details data:', response.message);
                    $(table).closest('.details-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "productName",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "quantity",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="badge fw-bold fs-6">${data || 0}</span>`;
                }
            },
            {
                "data": "price",
                "className": "text-end",
                "render": function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "total",
                "className": "text-end",
                "render": function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "paymentType",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="badge fw-bold fs-6">${data || ''}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 2. المبيعات
function initializeSalesTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementSales?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.sales-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No sales data:', response.message);
                    $(table).closest('.sales-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "productName",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "quantity",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="badge fw-bold fs-6">${data || 0}</span>`;
                }
            },
            {
                "data": "price",
                "className": "text-end",
                "render": function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "total",
                "className": "text-end",
                "render": function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "paymentType",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="badge fw-bold fs-6">${data || ''}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 3. المصروفات
function initializeExpensesTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementExpenses?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.expenses-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No expenses data:', response.message);
                    $(table).closest('.expenses-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "categoryName",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "quantity",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="badge fw-bold fs-6">${data || 0}</span>`;
                }
            },
            {
                "data": "amount",
                "className": "text-end",
                "render": function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "total",
                "className": "text-end",
                "render": function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 4. الموردين
function initializeSuppliersTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementSuppliers?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.suppliers-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No suppliers data:', response.message);
                    $(table).closest('.suppliers-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "supplierName",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "amount",
                "render": function (data) {
                    return `<span class="fw-bold fs-5">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "paymentType",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 5. العملاء
function initializeCustomersTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementCustomers?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.customers-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No customers data:', response.message);
                    $(table).closest('.customers-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "customerName",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "amount",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="fw-bold fs-5">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "paymentType",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="fw-bold fs-5">${data || ''}</span>`;
                }
            },
            {
                "data": "notes",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="fw-bold fs-5">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 6. التسليم
function initializeTaslimTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementTaslim?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.taslim-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No taslim data:', response.message);
                    $(table).closest('.taslim-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "receiver",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "amount",
                "render": function (data) {
                    return `<span class="fw-bold fs-5">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 7. الوارد
function initializeWaridTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementWarid?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.warid-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No warid data:', response.message);
                    $(table).closest('.warid-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "receiver",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "amount",
                "render": function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 8. الأرصدة
function initializeBalancesTable(table, movementId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementBalances?movementId=${movementId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.balances-section').hide();
                    } else {
                        // تحديث الإجمالي
                        const totalClass = response.total >= 0 ? 'text-success' : 'text-danger';
                        $(`.balance-total-${movementId}`).text(response.total.toFixed(2)).addClass(totalClass);
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No balances data:', response.message);
                    $(table).closest('.balances-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "type",
                "render": function (data) {
                    return `<span class="badge fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "amount",
                "className": "text-end",
                "render": function (data) {
                    return `<span class="fw-bold fs-6">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// 9. النفوق
function initializeMortalityTable(table, movementId, userId) {
    $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": `/ManagementDashboard/GetMovementMortality?movementId=${movementId}&userId=${userId}`,
            "dataSrc": function (response) {
                if (response.success) {
                    if (!response.data || response.data.length === 0) {
                        $(table).closest('.mortality-section').hide();
                    }
                    return response.data;
                } else {
                    console.warn('⚠️ No mortality data:', response.message);
                    $(table).closest('.mortality-section').hide();
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "productName",
                "render": function (data) {
                    return `<span class="text-dark fw-bold">${data || ''}</span>`;
                }
            },
            {
                "data": "quantity",
                "render": function (data) {
                    return `<span class="fw-bold fs-5">${parseFloat(data || 0).toFixed(2)}</span>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<span class="fw-bold">${data || ''}</span>`;
                }
            }
        ]
    });
}

// دالة البحث بالتاريخ
function filterByDate() {
    var date = document.getElementById('dateFilter')?.value ||
        document.getElementById('dateFilterMobile')?.value;

    if (date && date.length >= 8) {
        window.location.href = '/ManagementDashboard/ViewAllDailyMovements?date=' + date;
    }
}

// دالة الطباعة
function printReport() {
    window.print();
}