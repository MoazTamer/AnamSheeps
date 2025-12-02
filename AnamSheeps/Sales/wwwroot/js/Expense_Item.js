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
                "url": "/Expense_Item/GetExpenseItems"
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
                { targets: [0, 2], orderable: false, searchable: false, className: "text-center" },
                { targets: [1], className: "text-center" }
            ],
            "columns": [
                { "data": null },
                { "data": "expenseItem_Name" },
                {
                    "data": "expenseItem_ID",
                    "render": function (data) {
                        return `
                                <a onclick=EditGet("/Expense_Item/Edit/${data}") style="cursor:pointer">
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


function EditGet(url) {
    axios.get(url)
        .then(function (response) {
            $('#divModal').empty();
            $('#divModal').html(response.data);
            $('#kt_modal_edit').modal('show');
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
                'expenseItem_Name': {
                    validators: {
                        notEmpty: {
                            message: 'تأكد من تسجيل إسم بند المصروف'
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
                // Disable button to avoid multiple click 
                submitButton.disabled = true;

                axios.post(form.action, new FormData(form))
                    .then(function (response) {
                        if (response.data.isValid) {
                            Swal.fire({
                                text: response.data.message,
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "موافق",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function () {
                                // إضافة الصف الجديد للجدول
                                datatable.row.add(response.data.data).draw();

                                // إعادة تعيين الفورم وإغلاق المودال
                                form.reset();
                                $('#kt_modal_add').modal('hide');

                                // إعادة تعيين الفاليديشن
                                validator.resetForm();
                            });
                        } else {
                            Swal.fire({
                                text: response.data.message,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "موافق",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "حدث خطأ أثناء الحفظ، من فضلك حاول مرة أخرى",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "موافق",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    })
                    .finally(function () {
                        // إخفاء مؤشر التحميل
                        submitButton.removeAttribute('data-kt-indicator');
                        // تفعيل الزر مرة أخرى
                        submitButton.disabled = false;
                        // إزالة البلوك
                        blockUI.release();
                    });
            } else {
                // إذا كان الفورم غير صالح، نعرض رسالة خطأ
                Swal.fire({
                    text: "من فضلك تأكد من صحة البيانات المدخلة",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "موافق",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
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
                'expenseItem_Name': {
                    validators: {
                        notEmpty: {
                            message: 'تأكد من تسجيل بند المصروف'
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
                // Disable button to avoid multiple click 
                submitButton.disabled = true;

                axios.post(form.action, new FormData(form))
                    .then(function (response) {
                        if (response.data.isValid) {
                            Swal.fire({
                                text: response.data.message,
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "موافق",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function () {
                                // تحديث الصف في الجدول
                                datatable.row(rowIndex).data(response.data.data).draw();

                                // إغلاق المودال
                                $('#kt_modal_edit').modal('hide');

                                // إعادة تعيين الفاليديشن
                                validator.resetForm();
                            });
                        } else {
                            Swal.fire({
                                text: response.data.message,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "موافق",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "حدث خطأ أثناء الحفظ، من فضلك حاول مرة أخرى",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "موافق",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    })
                    .finally(function () {
                        // إخفاء مؤشر التحميل
                        submitButton.removeAttribute('data-kt-indicator');
                        // تفعيل الزر مرة أخرى
                        submitButton.disabled = false;
                        // إزالة البلوك
                        blockUI.release();
                    });
            } else {
                // إذا كان الفورم غير صالح، نعرض رسالة خطأ
                Swal.fire({
                    text: "من فضلك تأكد من صحة البيانات المدخلة",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "موافق",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            }
        });
    }
    return false;
}
function Delete(url) {
    Swal.fire({
        title: "هل انت متأكد ؟",
        text: "سيتم حذف بند المصروف",
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
                        title: "بنود المصروفات",
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