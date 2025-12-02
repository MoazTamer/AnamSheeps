$(document).ready(function () {
    if (typeof moment !== 'undefined') {
        moment.locale('ar');
    }

    let trackingTable;
    let isInitialized = false;

    function initializeDataTable() {
        if (isInitialized) return;

        const dataTableConfig = {
            responsive: true,
            processing: true,
            serverSide: true,
            searching: false,
            paging: true,
            info: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
            "language": {
                "search": "بحث: ",
                "emptyTable": "لا توجد بيانات لأمناء المستودعات",
                "loadingRecords": "جارى التحميل ...",
                "processing": "جارى التحميل ...",
                "lengthMenu": "عرض _MENU_ مستودع",
                "paginate": {
                    "first": "الأول",
                    "last": "الأخير",
                    "next": "التالى",
                    "previous": "السابق"
                },
                "info": "عرض _START_ الى _END_ من _TOTAL_ مستودع",
                "infoFiltered": "(_TOTAL_ إجمالى المستودعات)",
                "infoEmpty": "لا توجد بيانات للعرض",
                "zeroRecords": "لا توجد بيانات للعرض"
            },
            'order': [[1, 'asc']],
            fixedHeader: {
                header: true
            },
            ajax: {
                url: '/ManagementDashboard/GetWarehouseMovementsTracking',
                type: 'GET',
                data: function (d) {
                    d.date = $('#dateFilter').val() || $('#dateFilterMobile').val();
                    return d;
                },
                dataSrc: function (json) {
                    if (json && json.summary) {
                        updateSummaryCards(json.summary);
                    }
                    return json ? json.data : [];
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
                    className: "text-center text-dark",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    data: "userName",
                    name: "userName",
                    className: "fw-bold text-start text-dark",
                    render: function (data, type, row) {
                        return `
                            <div class="d-flex align-items-center">
                                <div class="symbol symbol-40px me-3">
                                    <span class="symbol-label bg-light-info text-info fs-6 fw-bold">
                                        ${data ? data.substring(0, 1) : '?'}
                                    </span>
                                </div>
                                <div class="d-flex justify-content-start flex-column">
                                    <span class="text-dark fw-bold fs-6">${data || 'غير معروف'}</span>
                                </div>
                            </div>
                        `;
                    }
                },
                {
                    data: "userType",
                    name: "userType",
                    className: "fw-bold text-center fw-bold text-dark",
                    render: function (data) {
                        return `<span class="badge badge-light-primary">${data || '-'}</span>`;
                    }
                },
                {
                    data: "hasMovement",
                    name: "statusText",
                    className: "text-center text-dark",
                    render: function (data, type, row) {
                        const badgeClass = data ? 'success' : 'danger';
                        const iconClass = data ? 'ki-check-circle' : 'ki-close-circle';
                        const statusText = data ? 'تم الإدخال' : 'لم يتم الإدخال';

                        return `
                            <span class="badge badge-light-${badgeClass} fs-7 fw-bold">
                                <i class="ki-duotone ${iconClass} fs-5 me-1">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
                                ${statusText}
                            </span>
                        `;
                    }
                },
                {
                    data: "lastUpdateDate",
                    name: "lastUpdateDate",
                    className: "text-center fw-bold text-dark",
                    render: function (data) {
                        if (!data) return '<span class="text-dark fw-bold">-</span>';

                        const date = new Date(data);
                        return `
                            <div class="text-dark fw-bold">
                                <div>${date.toLocaleDateString('ar-EG')}</div>
                                <div class="fs-7">${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        `;
                    }
                },
                {
                    data: "movementId",
                    name: "actions",
                    orderable: false,
                    searchable: false,
                    className: "text-center text-dark",
                    render: function (data, type, row) {
                        if (row.hasMovement && data > 0) {
                            const viewUrl = typeof pageData !== 'undefined' ? pageData.viewMovementUrl : '/ManagementDashboard/ViewWarehouseMovement';
                            return `
                                <a href="${viewUrl}?movementId=${data}"
                                   class="btn btn-sm btn-light-primary">
                                    <i class="ki-duotone ki-eye fs-5">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                        <span class="path3"></span>
                                    </i>
                                    عرض
                                </a>
                            `;
                        } else {
                            return '<span class="text-muted fs-7">لا يوجد بيان</span>';
                        }
                    }
                }
            ],
            initComplete: function () {
                updateTableDate();
                isInitialized = true;
                console.log('DataTable initialized successfully');
            }
        };

        trackingTable = $('#trackingTable').DataTable(dataTableConfig);
    }

    function loadTrackingData() {
        const date = $('#dateFilter').val() || $('#dateFilterMobile').val();

        console.log('Loading data for date:', date);

        if (!date) {
            showWarning('الرجاء اختيار تاريخ');
            return;
        }

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            showWarning('الرجاء إدخال تاريخ صحيح');
            return;
        }

        showLoader();

        updateTableDate();

        if (trackingTable && typeof trackingTable.ajax !== 'undefined') {
            trackingTable.ajax.reload(function (json) {
                hideLoader();
                if (json && json.error) {
                    showError(json.error);
                } else {
                    showSuccess('تم تحميل البيانات بنجاح');
                }
            });
        } else {
            initializeDataTable();
            hideLoader();
        }
    }

    function updateTableDate() {
        const date = $('#dateFilter').val() || $('#dateFilterMobile').val();
        if (date) {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                const formattedDate = dateObj.toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                $('#tableDate').text('التاريخ: ' + formattedDate);
            }
        }
    }

    function updateSummaryCards(summary) {
        if (!summary) {
            console.warn('No summary data provided');
            return;
        }

        const summaryHtml = `
            <div class="col-md-3">
                <div class="card card-flush h-100">
                    <div class="card-body text-center">
                        <i class="ki-duotone ki-home fs-3x text-primary mb-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </i>
                        <div class="fs-2hx fw-bold text-gray-800">${summary.totalCount || 0}</div>
                        <div class="fs-6 text-gray-400 fw-semibold">إجمالي المستودعات</div>
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
                        <div class="fs-2hx fw-bold text-success">${summary.enteredCount || 0}</div>
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
                        <div class="fs-2hx fw-bold text-danger">${summary.notEnteredCount || 0}</div>
                        <div class="fs-6 text-gray-600 fw-semibold">لم يتم الإدخال</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-flush h-100 bg-info bg-opacity-10">
                    <div class="card-body text-center">
                        <i class="ki-duotone ki-box fs-3x text-info mb-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </i>
                        <div class="fs-2hx fw-bold text-warning">${summary.entryPercentage || 0}%</div>
                        <div class="fs-6 text-gray-600 fw-semibold">نسبة الإدخال</div>
                    </div>
                </div>
            </div>
        `;

        $('#summaryCards').html(summaryHtml);
    }

    function showLoader() {
        $('#loader').show();
    }

    function hideLoader() {
        $('#loader').hide();
    }

    function showWarning(message) {
        if (typeof toastr !== 'undefined') {
            toastr.warning(message);
        } else {
            alert(message);
        }
    }

    function showError(message) {
        if (typeof toastr !== 'undefined') {
            toastr.error(message);
        } else {
            alert('خطأ: ' + message);
        }
    }

    function showSuccess(message) {
        if (typeof toastr !== 'undefined') {
            toastr.success(message);
        } else {
            alert(message);
        }
    }

    function initializeDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = document.querySelectorAll('input[type="date"]');

        dateInputs.forEach(function (input) {
            if (!input.value) {
                input.value = today;
            }
        });
    }

    window.loadTrackingData = loadTrackingData;
    window.initializeDataTable = initializeDataTable;

    $(function () {
        initializeDate();

        setTimeout(function () {
            initializeDataTable();
            loadTrackingData();
        }, 300);
    });

    function checkRequiredLibraries() {
        if (typeof $ === 'undefined') {
            console.error('jQuery is not loaded');
            return false;
        }
        if (typeof $.fn.DataTable === 'undefined') {
            console.error('DataTables is not loaded');
            return false;
        }
        return true;
    }

    if (!checkRequiredLibraries()) {
        console.warn('Some required libraries are missing. DataTable may not work properly.');
    }
});