"use strict";
var datatable;
var rowIndex;


var KTList = function () {
    // Define shared variables
    var table = document.getElementById('kt_table');

    // Private functions
    var initTable = function () {
        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            responsive: true,
            processing: true,
            "ajax": {
                "url": "/Customer/GetCustomer"
            },
            "language": {
                "search": "البحث ",
                "emptyTable": "لا توجد بيانات",
                "loadingRecords": "جارى التحميل ...",
                "processing": "جارى التحميل ...",
                "lengthMenu": "عرض _MENU_",
                "paginate": {
                    "first": "الأول",
                    "last": "الأخير",
                    "next": "التالى",
                    "previous": "السابق"
                },
                "info": "عرض _START_ الى _END_ من _TOTAL_ المدخلات",
                "infoFiltered": "(البحث من _MAX_ إجمالى المدخلات)",
                "infoEmpty": "لا توجد مدخلات للعرض",
                "zeroRecords": "لا توجد مدخلات مطابقة للبحث"
            },
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 100,
            fixedHeader: {
                header: true
            },
            'order': [],
            'columnDefs': [
                { targets: [0, 4], orderable: false, searchable: false, className: "text-center" },
                { targets: [1, 2, 3], className: "text-center" }
            ],
            "columns": [
                { "data": null },
                { "data": "customer_Name" },
                {
                    "data": "customer_Phone",
                    "render": function (data) {
                        return data ? data : '-';
                    }
                },
                {
                    "data": "customer_Address",
                    "render": function (data) {
                        return data ? data : '-';
                    }
                },
                {
                    "data": "customer_ID",
                    "render": function (data) {
                        return `
                                <a onclick=EditGet("/Customer/Edit/${data}") style="cursor:pointer">
                                   <i class="fa-solid fa-pen-to-square text-success fs-1"></i>
                                </a>
                           `;
                    }
                },
            ]
        });

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw

        datatable.on('click', 'tr', function () {
            rowIndex = datatable.row(this).index();
        });

        datatable.on('order.dt search.dt', function () {
            datatable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
                datatable.cell(cell).invalidate('dom');
            });
        }).draw();
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-user-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }


    return {
        // Public functions  
        init: function () {
            if (!table) {
                return;
            }

            initTable();
            handleSearchDatatable();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTList.init();
});

function CreateGet(url) {
    axios.get(url)
        .then(function (response) {
            $('#divModal').empty();
            $('#divModal').html(response.data);
            $('#kt_modal_add').modal('show');
        })
}

function CreatePost() {
    const element = document.getElementById('kt_modal_add');
    const form = element.querySelector('#kt_modal_add_form');

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    var validator = FormValidation.formValidation(
        form,
        {
            fields: {
                'customer_Name': {
                    validators: {
                        notEmpty: {
                            message: 'تأكد من تسجيل إسم العميل'
                        }
                    }
                },
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row', 
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }
    );

    // Submit button handler
    const submitButton = element.querySelector('[data-kt-modal-action="submit"]');

    // Validate form before submit
    if (validator) {
        validator.validate().then(function (status) {
            if (status == 'Valid') {
                var blockUI = new KTBlockUI(form, {
                    overlayClass: "bg-danger bg-opacity-25",
                    message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>من فضلك إنتظر ...</div>',
                });
                blockUI.block();

                // Show loading indication
                submitButton.setAttribute('data-kt-indicator', 'on');
                submitButton.disabled = true;

                axios.post(form.action, new FormData(form))
                    .then(function (response) {
                        if (response.data.isValid) {
                            swal.fire({
                                title: response.data.title,
                                text: response.data.message,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then(function () {
                                datatable.row.add(response.data.data).draw();
                                $('#kt_modal_add').modal('hide');
                                form.reset();
                                validator.resetForm();
                                blockUI.release();
                            });
                        } else {
                            swal.fire({
                                title: response.data.title,
                                text: response.data.message,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "موافق",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-light-primary"
                                }
                            });
                            blockUI.release();
                        }
                    })
                    .catch(function (error) {
                        swal.fire({
                            title: "العملاء",
                            text: "من فضلك تأكد من تسجيل البيانات بطريقة صحيحة",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "موافق",
                            customClass: {
                                confirmButton: "btn fw-bold btn-light-primary"
                            }
                        });
                        blockUI.release();
                    })
                    .finally(function () {
                        submitButton.removeAttribute('data-kt-indicator');
                        submitButton.disabled = false;
                    });

            } else {
                KTUtil.scrollTop();
            }
        });
    }
    return false;
}

function EditPost() {
    const element = document.getElementById('kt_modal_edit');
    const form = element.querySelector('#kt_modal_edit_form');

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    var validator = FormValidation.formValidation(
        form,
        {
            fields: {
                'customer_Name': {
                    validators: {
                        notEmpty: {
                            message: 'تأكد من تسجيل إسم العميل'
                        }
                    }
                },
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row', 
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }
    );

    // Submit button handler
    const submitButton = element.querySelector('[data-kt-modal-action="submit"]');

    // Validate form before submit
    if (validator) {
        validator.validate().then(function (status) {
            if (status == 'Valid') {
                var blockUI = new KTBlockUI(form, {
                    overlayClass: "bg-danger bg-opacity-25",
                    message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>من فضلك إنتظر ...</div>',
                });
                blockUI.block();

                // Show loading indication
                submitButton.setAttribute('data-kt-indicator', 'on');
                submitButton.disabled = true;

                axios.post(form.action, new FormData(form))
                    .then(function (response) {
                        if (response.data.isValid) {
                            swal.fire({
                                title: response.data.title,
                                text: response.data.message,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then(function () {
                                datatable.row(rowIndex).data(response.data.data).draw();
                                $('#kt_modal_edit').modal('hide');
                                validator.resetForm();
                                blockUI.release();
                            });
                        } else {
                            swal.fire({
                                title: response.data.title,
                                text: response.data.message,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "موافق",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-light-primary"
                                }
                            });
                            blockUI.release();
                        }
                    })
                    .catch(function (error) {
                        swal.fire({
                            title: "العملاء",
                            text: "من فضلك تأكد من تسجيل البيانات بطريقة صحيحة",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "موافق",
                            customClass: {
                                confirmButton: "btn fw-bold btn-light-primary"
                            }
                        });
                        blockUI.release();
                    })
                    .finally(function () {
                        submitButton.removeAttribute('data-kt-indicator');
                        submitButton.disabled = false;
                    });

            } else {
                KTUtil.scrollTop();
            }
        });
    }
    return false;
}
function EditGet(url) {
    axios.get(url)
        .then(function (response) {
            $('#divModal').empty();
            $('#divModal').html(response.data);
            $('#kt_modal_edit').modal('show');
        })
}

function Delete(url) {
    Swal.fire({
        title: "هل انت متأكد ؟",
        text: "سيتم حذف العميل",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "موافق",
        cancelButtonText: "الغاء",
        customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary"
        }
    }).then(function (result) {
        if (result.value) {

            axios.post(url)
                .then(function (response) {
                    if (response.data.isValid) {
                        swal.fire({
                            title: response.data.title,
                            text: response.data.message,
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        }).then(function () {
                            // Remove current row
                            datatable.row(rowIndex).remove().draw();
                            $('#kt_modal_edit').modal('hide');
                        });
                    } else {
                        swal.fire({
                            title: response.data.title,
                            text: response.data.message,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "موافق",
                            customClass: {
                                confirmButton: "btn fw-bold btn-light-primary"
                            }
                        });
                    }
                })
                .catch(function (error) {
                    swal.fire({
                        title: "العملاء",
                        text: "من فضلك تأكد من تسجيل البيانات بطريقة صحيحة",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "موافق",
                        customClass: {
                            confirmButton: "btn fw-bold btn-light-primary"
                        }
                    });
                });
        }
    });

    return false;
}