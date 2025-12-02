let trackingTable;
let isInitialized = false;

$(document).ready(function () {
    initializeDataTable();

    $('#searchBtn').on('click', function () {
        searchByDate();
    });

    $('#dateFilter').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            searchByDate();
        }
    });
});

function searchByDate() {
    const date = $('#dateFilter').val();

    if (!date) {
        showError('الرجاء اختيار تاريخ');
        return;
    }

    if (trackingTable) {
        $('#tableDateText').text('التاريخ: ' + formatDateForDisplay(date));

        trackingTable.ajax.reload();
    }
}

function initializeDataTable() {
    if (isInitialized) return;

    const dataTableConfig = {
        responsive: true,
        processing: true,
        serverSide: false, 
        searching: false,
        paging: true,
        info: true,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
        language: {
            search: "البحث ",
            emptyTable: "لا توجد بيانات",
            loadingRecords: "جارى التحميل ...",
            processing: "جارى التحميل ...",
            lengthMenu: "عرض _MENU_",
            paginate: {
                first: "الأول",
                last: "الأخير",
                next: "التالى",
                previous: "السابق"
            },
            info: "عرض _START_ الى _END_ من _TOTAL_ مدخلات",
            infoFiltered: "(البحث من _MAX_ إجمالى المدخلات)",
            infoEmpty: "لا توجد مدخلات للعرض",
            zeroRecords: "لا توجد مدخلات مطابقة للبحث"
        },
        order: [[1, 'asc']],
        fixedHeader: {
            header: true
        },
        ajax: {
            url: '/ManagementDashboard/GetDailyMovementsTracking',
            type: 'GET',
            data: function () {
                return {
                    date: $('#dateFilter').val() || '@selectedDate.ToString("yyyy-MM-dd")'
                };
            },
            dataSrc: function (json) {
                if (json && json.success && json.data) {
                    updateSummaryCards(json.data);

                    calculateTotalBalance(json.data);

                    return json.data;
                } else {
                    showError('حدث خطأ في تحميل البيانات');
                    return [];
                }
            },
            error: function (xhr, error, thrown) {
                console.error('Error loading data:', error, thrown);
                showError('حدث خطأ في تحميل البيانات');
                return [];
            }
        },
        columns: [
            {
                data: null,
                name: "index",
                orderable: false,
                className: "text-center fw-bold",
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: "userName",
                name: "userName",
                className: "text-center fw-bold",
                render: function (data) {
                    return escapeHtml(data || '');
                }
            },
            {
                data: "hasMovement",
                name: "hasMovement",
                className: "text-center fw-bold",
                render: function (data) {
                    if (data) {
                        return `<span class="badge badge-light-success fs-7 fw-bold">
                                    <i class="ki-duotone ki-check-circle fs-5 me-1"></i>
                                    تم الإدخال
                                </span>`;
                    } else {
                        return `<span class="badge badge-light-danger fs-7 fw-bold">
                                    <i class="ki-duotone ki-close-circle fs-5 me-1"></i>
                                    لم يتم الإدخال
                                </span>`;
                    }
                }
            },
            {
                data: "lastBalance",
                name: "lastBalance",
                className: "text-center",
                render: function (data) {
                    return `<span class="fw-bold">${parseFloat(data || 0).toFixed(0)}</span>`;
                }
            },
            {
                data: "lastUpdateDate",
                name: "lastUpdateDate",
                className: "text-center fw-bold",
                render: function (data) {
                    if (!data) return '<span class="">-</span>';
                    return formatDate(data);
                }
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                className: "text-center fw-bold",
                render: function (data) {
                    if (data.hasMovement && data.movementId > 0) {
                        return `
                            <a href="/ManagementDashboard/ViewDailyMovement?movementId=${data.movementId}"
                                class="btn btn-sm btn-light-primary">
                                <i class="ki-duotone ki-eye fs-5"></i> عرض
                            </a>`;
                    }
                    return '<span class="text-muted fs-7">لا يوجد بيان</span>';
                }
            }
        ],
        drawCallback: function () {
            const api = this.api();
            const data = api.rows({ page: 'current' }).data().toArray();
            calculateTotalBalance(data);
        },
        initComplete: function () {
            updateTableDate();
            isInitialized = true;
            console.log('DataTable initialized successfully');
        }
    };

    trackingTable = $('#trackingTable').DataTable(dataTableConfig);
}

function updateSummaryCards(data) {
    const totalUsers = data.length;
    const hasMovementCount = data.filter(item => item.hasMovement).length;
    const noMovementCount = totalUsers - hasMovementCount;
    const percentage = totalUsers > 0 ? Math.round((hasMovementCount * 100) / totalUsers) : 0;

    const summaryCardsHTML = `
        <div class="col-md-3">
            <div class="card card-flush h-100">
                <div class="card-body text-center">
                    <i class="ki-duotone ki-people fs-3x text-primary mb-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    <div class="fs-2hx fw-bold text-gray-800">${totalUsers}</div>
                    <div class="fs-6 text-gray-400 fw-semibold">إجمالي المندوبين</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card card-flush h-100 bg-success bg-opacity-10">
                <div class="card-body text-center">
                    <i class="ki-duotone ki-check-circle fs-3x text-success mb-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    <div class="fs-2hx fw-bold text-success">${hasMovementCount}</div>
                    <div class="fs-6 text-gray-600 fw-semibold">تم الإدخال</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card card-flush h-100 bg-danger bg-opacity-10">
                <div class="card-body text-center">
                    <i class="ki-duotone ki-close-circle fs-3x text-danger mb-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    <div class="fs-2hx fw-bold text-danger">${noMovementCount}</div>
                    <div class="fs-6 text-gray-600 fw-semibold">لم يتم الإدخال</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card card-flush h-100 bg-warning bg-opacity-10">
                <div class="card-body text-center">
                    <i class="ki-duotone ki-chart-simple fs-3x text-warning mb-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    <div class="fs-2hx fw-bold text-warning">${percentage}%</div>
                    <div class="fs-6 text-gray-600 fw-semibold">نسبة الإدخال</div>
                </div>
            </div>
        </div>
    `;

    $('#summaryCards').html(summaryCardsHTML);
}

function calculateTotalBalance(data) {
    let total = 0;

    if (data && data.length > 0) {
        data.forEach(item => {
            const balance = parseFloat(item.lastBalance) || 0;
            total += balance;
        });
    }

    $('#totalBalanceCell').text(total.toFixed(0));
}

function formatDate(dateString) {
    if (!dateString) return '<span class="">-</span>';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleString("ar");
    } catch (e) {
        return dateString;
    }
}

function formatDateForDisplay(dateString) {
    if (!dateString) return '';

    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return dateString;
}

function updateTableDate() {
    const date = $('#dateFilter').val();
    if (date) {
        $('#tableDateText').text('التاريخ: ' + formatDateForDisplay(date));
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    $('#trackingTable tbody').html(`
        <tr>
            <td colspan="6" class="text-center py-5 text-danger">
                <i class="ki-duotone ki-cross-circle fs-2x text-danger me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                </i>
                <div class="fs-5 fw-bold">${message}</div>
            </td>
        </tr>
    `);

    $('#summaryCards').html(`
        <div class="col-12">
            <div class="alert alert-danger d-flex align-items-center">
                <i class="ki-duotone ki-cross-circle fs-2x text-danger me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                </i>
                <span>${message}</span>
            </div>
        </div>
    `);

    $('#totalBalanceCell').text('0');
}