$(document).ready(function () {
            var today = new Date();
    var firstDay = new Date();

    $('#fromDate').val(firstDay.toISOString().split('T')[0]);
    $('#toDate').val(today.toISOString().split('T')[0]);

    var table = $('#salesTable').DataTable({
        processing: true,
    serverSide: false,
    ajax: {
        url: '/Reports/GetSales',
    type: 'GET',
    data: function (d) {
                    var fromDate = $('#fromDate').val();
    var toDate = $('#toDate').val();

    console.log('Sending dates to API - From:', fromDate, 'To:', toDate);

    d.fromDate = fromDate;
    d.toDate = toDate;
                    },
    dataSrc: function (json) {
        calculateTotals(json.data || json);
    return json.data || json;
                    }
                },
    columns: [
    {
        data: null,
                        // render: function (data, type, row, meta) {
        //     return meta.row + 1;
        // }
    },
    {
        data: 'date',
    render: function(data) {
                            if (!data) return '-';
    var date = new Date(data);
    return date.toLocaleDateString('en-GB');
                        }
                    },
    {
        data: 'userName',
    render: function(data) {
                            return data || '-';
                        }
                    },
    {
        data: 'productName',
    render: function(data) {
                            return data || '-';
                        }
                    },
    {
        data: 'quantity',
    render: function(data) {
                            return data ? parseInt(data) : '0';
                        },
    className: "text-center"
                    },
    {
        data: 'price',
    render: function(data) {
                            return data ? parseFloat(data).toFixed(2) : '0.00';
                        },
    className: "text-center"
                    },
    {
        data: 'total',
    render: function(data) {
                            return data ? parseFloat(data).toFixed(2) : '0.00';
                        },
    className: "text-center"
                    },
    {
        data: 'paymentType',
    render: function(data) {
                            return data || '-';
                        }
                    }
    ],
    dom: '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6"f>>rtip',
    buttons: [
                    // {
                    //     extend: 'excel',
                    //     text: '<i class="fas fa-file-excel"></i> تصدير Excel',
                    //     className: 'btn btn-success btn-sm',
                    //     title: 'تقرير المبيعات',
                    //     messageTop: 'تقرير المبيعات للفترة من ' + $('#fromDate').val() + ' إلى ' + $('#toDate').val(),
                    //     filename: 'تقرير_المبيعات_' + new Date().toISOString().split('T')[0]
                    // },
                    // {
                    //     extend: 'print',
                    //     text: '<i class="fas fa-print"></i> طباعة',
                    //     className: 'btn btn-info btn-sm',
                    //     title: 'تقرير المبيعات',
                    //     messageTop: 'تقرير المبيعات للفترة من ' + $('#fromDate').val() + ' إلى ' + $('#toDate').val(),
                    //     customize: function (win) {
                    //         $(win.document.body).css('direction', 'rtl');
                    //         $(win.document.body).find('table').addClass('table-bordered');
                    //     }
                    // }
                ],
    language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/ar.json"
                },
    pageLength: 10,
    responsive: true,
        order: [[1, 'desc']],
        drawCallback: function () {
            var api = this.api();
            var filteredData = api.rows({ search: 'applied' }).data().toArray();
            calculateTotals(filteredData);
        }
            });

    table.on('order.dt search.dt draw.dt', function () {
        table.column(0, { search: 'applied', order: 'applied' })
            .nodes()
            .each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

    function calculateTotals(data) {
        let totalQuantity = 0;
    let totalAmount = 0;

                if (data && data.length > 0) {
        data.forEach(function (item) {
            totalQuantity += parseInt(item.quantity) || 0;
            totalAmount += parseFloat(item.total) || 0;
        });
                }

    $('#totalQuantity').text(totalQuantity);
    $('#totalAmount').text(totalAmount.toFixed(2));
            }

    function filterByDate() {
                var fromDate = $('#fromDate').val();
    var toDate = $('#toDate').val();

    if (fromDate && toDate) {
                    if (new Date(fromDate) > new Date(toDate)) {
        alert('⚠️ تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
    return;
                    }
                }

    table.ajax.reload();
            }

    function resetDateFilter() {
        var today = new Date();
        var firstDay = new Date();

        $('#fromDate').val(firstDay.toISOString().split('T')[0]);
        $('#toDate').val(today.toISOString().split('T')[0]);

        table.ajax.reload();
                }

        $('#filterBtn').on('click', filterByDate);
        $('#resetBtn').on('click', resetDateFilter);

        $('#fromDate, #toDate').on('keypress', function(e) {
                    if (e.which === 13) {
            filterByDate();
                    }
         });
      });
