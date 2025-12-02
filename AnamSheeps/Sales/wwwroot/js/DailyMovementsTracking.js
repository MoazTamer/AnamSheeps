const dataTableConfig = {
    responsive: true,
    processing: true,
    searching: false,
    paging: false,
    info: false,
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
        info: "عرض _START_ الى _END_ من _TOTAL_ المدخلات",
        infoFiltered: "(البحث من _MAX_ إجمالى المدخلات)",
        infoEmpty: "لا توجد مدخلات للعرض",
        zeroRecords: "لا توجد مدخلات مطابقة للبحث"
    },
    order: [],
    fixedHeader: { header: true }
};

$(document).ready(function () {

    const selectedDate = "@selectedDate.ToString('yyyy-MM-dd')";

    const table = $('#trackingTable').DataTable({
        ...dataTableConfig,
        ajax: {
            url: "/ManagementDashboard/GetDailyMovementsTracking",
            data: { date: selectedDate },
            dataSrc: "data"
        },
        columns: [
            {
                data: null,
                className: "text-center fw-bold",
                render: (data, type, row, meta) => meta.row + 1
            },
            {
                data: "userName",
                className: "text-center fw-bold",
            },
            {
                data: "hasMovement",
                className: "text-center fw-bold",
                render: function (data, type, row) {
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
                className: "text-center",
                render: d => `<span class="fw-bold">${d}</span>`
            },
            {
                data: "lastUpdateDate",
                className: "text-center fw-bold",
                render: function (d) {
                    if (!d) return `<span class="">-</span>`;
                    let date = new Date(d);
                    return date.toLocaleString("ar");
                }
            },
            {
                data: null,
                className: "text-center fw-bold",
                render: function (data) {
                    if (data.hasMovement)
                        return `
                            <a href="/ManagementDashboard/ViewDailyMovement?movementId=${data.movementId}"
                                class="btn btn-sm btn-light-primary">
                                <i class="ki-duotone ki-eye fs-5"></i> عرض
                            </a>`;
                    return `<span class="text-muted fs-7">لا يوجد بيان</span>`;
                }
            }
        ]
    });

});

