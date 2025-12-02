// ============================================
// Users DataTable & CRUD Operations
// ============================================

"use strict";

var KTUsersList = function () {
    var table;
    var datatable;

    // ============================================
    // Initialize DataTable
    // ============================================
    var initUserTable = function () {
        table = document.querySelector('#kt_table');

        if (!table) {
            return;
        }

        datatable = $(table).DataTable({
            "processing": true,
            "serverSide": true,
            "filter": true,
            "ajax": {
                "url": "/Users/GetData",
                "type": "POST",
                "datatype": "json"
            },
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": true,
                    "searchable": false,
                    "orderable": false,
                    "className": "text-center"
                }
            ],
            "columns": [
                {
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    "data": "branchName",
                    "name": "TblBranch.Branch_Name",
                    "className": "text-center",
                    "autoWidth": true
                },
                {
                    "data": "userName",
                    "name": "UserName",
                    "className": "text-center",
                    "autoWidth": true
                },
                {
                    "data": "userType",
                    "name": "UserType",
                    "className": "text-center",
                    "autoWidth": true,
                    "render": function (data) {
                        var badgeClass = '';
                        switch (data) {
                            case 'مندوب':
                                badgeClass = 'badge-light-primary';
                                break;
                            case 'أمين مستودع':
                                badgeClass = 'badge-light-success';
                                break;
                            case 'إدارة':
                                badgeClass = 'badge-light-danger';
                                break;
                            default:
                                badgeClass = 'badge-light-info';
                        }
                        return `<span class="badge ${badgeClass} fs-7 fw-bold">${data}</span>`;
                    }
                },
                {
                    "data": "id",
                    "orderable": false,
                    "className": "text-center",
                    "render": function (data) {
                        return `<a href="/Users/Permission/${data}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                                    <i class="ki-duotone ki-shield-tick fs-2">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </a>`;
                    }
                },
                {
                    "data": "id",
                    "orderable": false,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        return `<button onclick="EditGet('/Users/Edit/${data}')" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                    <i class="ki-duotone ki-pencil fs-2">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </button>
                                <button onclick="Delete('${data}', '${row.userName}')" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                                    <i class="ki-duotone ki-trash fs-2">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                        <span class="path3"></span>
                                        <span class="path4"></span>
                                        <span class="path5"></span>
                                    </i>
                                </button>`;
                    }
                }
            ],
            "language": {
                "lengthMenu": "عرض _MENU_",
                "zeroRecords": "لم يعثر على أي سجلات",
                "info": "إظهار صفحة _PAGE_ من _PAGES_",
                "infoEmpty": "لا يوجد سجلات متاحة",
                "infoFiltered": "(تصفية من _MAX_ مجموع السجلات)",
                "search": "بحث:",
                "paginate": {
                    "first": "الأول",
                    "last": "الأخير",
                    "next": "التالي",
                    "previous": "السابق"
                },
                "processing": "جارٍ المعالجة..."
            },
            "order": [[2, 'asc']]
        });

        // Search functionality
        const filterSearch = document.querySelector('[data-kt-user-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    return {
        init: function () {
            initUserTable();
        }
    };
}();

// ============================================
// Create User - Get Form
// ============================================
function CreateGet(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (res) {
            $('#divModal').html(res);
            $('#kt_modal_add').modal('show');
        },
        error: function (err) {
            toastr.error('حدث خطأ أثناء تحميل النموذج');
        }
    });
}

// ============================================
// Create User - Post Form
// ============================================
function CreatePost() {
    var form = $('#kt_modal_add_form');
    var submitButton = form.find('[data-kt-modal-action="submit"]');
    var cancelButton = form.find('[data-kt-modal-action="cancel"]');

    if (!form[0].checkValidity()) {
        form[0].reportValidity();
        return false;
    }

    // تحقق من أن الفرع والنوع مختارين
    //var branch = form.find('[name="BranchId"]').val();
    var branch = form.find('[name="branchID"]').val();

    var userType = form.find('[name="userType"]').val();

    if (!branch || branch === "0" || branch === "") {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'من فضلك اختر الفرع أولاً',
            confirmButtonText: 'موافق'
        });
        return false;
    }

    if (!userType || userType === "0" || userType === "") {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'من فضلك اختر نوع المستخدم أولاً',
            confirmButtonText: 'موافق'
        });
        return false;
    }

    // Disable buttons
    submitButton.prop('disabled', true);
    cancelButton.prop('disabled', true);

    // Show SweetAlert loading
    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    $.ajax({
        type: 'POST',
        url: form.attr('action'),
        data: form.serialize(),
        success: function (res) {
            Swal.close();

            if (res.isValid) {
                Swal.fire({
                    icon: 'success',
                    title: 'تم الحفظ بنجاح',
                    text: res.message,
                    confirmButtonText: 'موافق'
                });

                $('#kt_modal_add').modal('hide');
                $('#kt_table').DataTable().ajax.reload(null, false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'فشل الحفظ',
                    text: res.message,
                    confirmButtonText: 'موافق'
                });
            }
        },
        error: function () {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'حدث خطأ',
                text: 'حدث خطأ أثناء الحفظ',
                confirmButtonText: 'موافق'
            });
        },
        complete: function () {
            submitButton.prop('disabled', false);
            cancelButton.prop('disabled', false);
        }
    });

    return false;
}

// ============================================
// Edit User - Get Form
// ============================================
function EditGet(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (res) {
            $('#divModal').html(res);
            $('#kt_modal_edit').modal('show');
        },
        error: function (err) {
            toastr.error('حدث خطأ أثناء تحميل بيانات المستخدم');
        }
    });
}

// ============================================
// Edit User - Post Form
// ============================================
function EditPost() {
    var form = $('#kt_modal_edit_form');
    var submitButton = form.find('[data-kt-modal-action="submit"]');
    var cancelButton = form.find('[data-kt-modal-action="cancel"]');

    if (!form[0].checkValidity()) {
        form[0].reportValidity();
        return false;
    }

    // Disable buttons
    submitButton.prop('disabled', true);
    cancelButton.prop('disabled', true);

    // Show SweetAlert loading
    Swal.fire({
        title: 'جاري التعديل...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    $.ajax({
        type: 'POST',
        url: form.attr('action'),
        data: form.serialize(),
        success: function (res) {
            Swal.close();

            if (res.isValid) {
                Swal.fire({
                    icon: 'success',
                    title: 'تم التعديل بنجاح',
                    text: res.message,
                    confirmButtonText: 'موافق'
                });

                $('#kt_modal_edit').modal('hide');
                $('#kt_table').DataTable().ajax.reload(null, false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'فشل التعديل',
                    text: res.message,
                    confirmButtonText: 'موافق'
                });
            }
        },
        error: function () {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'حدث خطأ',
                text: 'حدث خطأ أثناء التعديل',
                confirmButtonText: 'موافق'
            });
        },
        complete: function () {
            submitButton.prop('disabled', false);
            cancelButton.prop('disabled', false);
        }
    });

    return false;
}
// ============================================
// Delete User
// ============================================
function Delete(id, userName) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        html: `سيتم حذف المستخدم: <strong>${userName}</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: '/Users/Delete',
                data: {
                    id: id,
                    __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
                },
                success: function (res) {
                    if (res.isValid) {
                        toastr.success(res.message);

                        // Reload DataTable after deletion
                        $('#kt_table').DataTable().ajax.reload(null, false);
                    } else {
                        toastr.error(res.message);
                    }
                },
                error: function (err) {
                    toastr.error('حدث خطأ أثناء الحذف');
                }
            });
        }
    });
}

// ============================================
// Initialize on Page Load
// ============================================
jQuery(document).ready(function () {
    KTUsersList.init();
});

//"use strict";
//var datatable;
//var rowIndex;


//var KTList = function () {
//    // Define shared variables
//    var table = document.getElementById('kt_table');

//    // Private functions
//    var initTable = function () {
//        // Init datatable --- more info on datatables: https://datatables.net/manual/
//        datatable = $(table).DataTable({
//            responsive: true,
//            processing: true,
//            "ajax": {
//                "url": "/Users/GetUser"
//            },
//            "language": {
//                "search": "البحث ",
//                "emptyTable": "لا توجد بيانات",
//                "loadingRecords": "جارى التحميل ...",
//                "processing": "جارى التحميل ...",
//                "lengthMenu": "عرض _MENU_",
//                "paginate": {
//                    "first": "الأول",
//                    "last": "الأخير",
//                    "next": "التالى",
//                    "previous": "السابق"
//                },
//                "info": "عرض _START_ الى _END_ من _TOTAL_ المدخلات",
//                "infoFiltered": "(البحث من _MAX_ إجمالى المدخلات)",
//                "infoEmpty": "لا توجد مدخلات للعرض",
//                "zeroRecords": "لا توجد مدخلات مطابقة للبحث"
//            },
//            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
//            "pageLength": 100,
//            fixedHeader: {
//                header: true
//            },
//            'order': [[2, 'asc']],
//            'columnDefs': [
//                { targets: [0, 5, 6], orderable: false, searchable: false, className: "text-center" },
//                { targets: [1, 2, 3, 4], className: "text-center" }
//            ],
//            "columns": [
//                { "data": null },
//                { "data": "branchName" },
//                { "data": "userName" },
//                { "data": "userType" },
//                {
//                    "data": "id",
//                    "render": function (data) {
//                        return `
//                <a href="/Users/Permission/${data}" style="cursor:pointer">
//                   <i class="fa-solid fa-user-lock text-info fs-1"></i>
//                </a>
//           `;
//                    }
//                },
//                {
//                    "data": "id",
//                    "render": function (data) {
//                        return `
//                <a onclick=EditGet("/Users/Edit/${data}") style="cursor:pointer">
//                   <i class="fa-solid fa-pen-to-square text-success fs-1"></i>
//                </a>
//           `;
//                    }
//                },
//            ]
//        });

//        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
//        datatable.on('click', 'tr', function () {
//            rowIndex = datatable.row(this).index();
//        });

//        datatable.on('order.dt search.dt', function () {
//            datatable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
//                cell.innerHTML = i + 1;
//                datatable.cell(cell).invalidate('dom');
//            });
//        }).draw();
//    }

//    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
//    var handleSearchDatatable = () => {
//        const filterSearch = document.querySelector('[data-kt-user-table-filter="search"]');
//        filterSearch.addEventListener('keyup', function (e) {
//            datatable.search(e.target.value).draw();
//        });
//    }

//    return {
//        // Public functions  
//        init: function () {
//            if (!table) {
//                return;
//            }

//            initTable();
//            handleSearchDatatable();
//        }
//    }
//}();

//// On document ready
//KTUtil.onDOMContentLoaded(function () {
//    KTList.init();
//});

//function CreateGet(url) {
//    axios.get(url)
//        .then(function (response) {
//            $('#divModal').empty();
//            $('#divModal').html(response.data);
//            $('#kt_modal_add').modal('show');
//        })
//}

//function CreatePost() {
//    const element = document.getElementById('kt_modal_add');
//    const form = element.querySelector('#kt_modal_add_form');

//    // Init form validation rules
//    var validator = FormValidation.formValidation(
//        form,
//        {
//            fields: {
//                'branchID': {
//                    validators: {
//                        notEmpty: {
//                            message: 'تأكد من إختيار الفرع'
//                        }
//                    }
//                },
//                'userName': {
//                    validators: {
//                        notEmpty: {
//                            message: 'تأكد من تسجيل إسم المستخدم'
//                        }
//                    }
//                },
//            },
//            plugins: {
//                trigger: new FormValidation.plugins.Trigger(),
//                bootstrap: new FormValidation.plugins.Bootstrap5({
//                    rowSelector: '.row',
//                    eleInvalidClass: '',
//                    eleValidClass: ''
//                })
//            }
//        }
//    );

//    const submitButton = element.querySelector('[data-kt-modal-action="submit"]');

//    if (validator) {
//        validator.validate().then(function (status) {
//            if (status == 'Valid') {
//                // Show loading indication on button only
//                submitButton.setAttribute('data-kt-indicator', 'on');
//                submitButton.disabled = true;

//                axios.post(form.action, new FormData(form))
//                    .then(function (response) {
//                        if (response.data.isValid) {
//                            swal.fire({
//                                title: response.data.title,
//                                text: response.data.message,
//                                icon: "success",
//                                showConfirmButton: false,
//                                timer: 1500
//                            }).then(function () {
//                                // Refresh the table
//                                datatable.ajax.reload();
//                                // Reset form
//                                validator.resetForm();
//                                form.reset();
//                                // Hide modal after success
//                                $('#kt_modal_add').modal('hide');
//                            });
//                        } else {
//                            swal.fire({
//                                title: response.data.title,
//                                text: response.data.message,
//                                icon: "error",
//                                buttonsStyling: false,
//                                confirmButtonText: "موافق",
//                                customClass: {
//                                    confirmButton: "btn fw-bold btn-light-primary"
//                                }
//                            });
//                        }
//                    })
//                    .catch(function (error) {
//                        swal.fire({
//                            title: "المستخدمين",
//                            text: "من فضلك تأكد من تسجيل البيانات بطريقة صحيحة",
//                            icon: "error",
//                            buttonsStyling: false,
//                            confirmButtonText: "موافق",
//                            customClass: {
//                                confirmButton: "btn fw-bold btn-light-primary"
//                            }
//                        });
//                    })
//                    .finally(function () {
//                        // هذا السطر سيتم تنفيذه دائماً سواء نجح الطلب أو فشل
//                        submitButton.removeAttribute('data-kt-indicator');
//                        submitButton.disabled = false;
//                    });
//            } else {
//                KTUtil.scrollTop();
//            }
//        });
//    }
//    return false;
//}
////function CreatePost() {
////    const element = document.getElementById('kt_modal_add');
////    const form = element.querySelector('#kt_modal_add_form');

////    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
////    var validator = FormValidation.formValidation(
////        form,
////        {
////            fields: {
////                'branchID': {
////                    validators: {
////                        notEmpty: {
////                            message: 'تأكد من إختيار الفرع'
////                        }
////                    }
////                },
////                'userName': {
////                    validators: {
////                        notEmpty: {
////                            message: 'تأكد من تسجيل إسم المستخدم'
////                        }
////                    }
////                },
////            },

////            plugins: {
////                trigger: new FormValidation.plugins.Trigger(),
////                bootstrap: new FormValidation.plugins.Bootstrap5({
////                    rowSelector: '.row',
////                    eleInvalidClass: '',
////                    eleValidClass: ''
////                })
////            }
////        }
////    );
////    // Submit button handler
////    const submitButton = element.querySelector('[data-kt-modal-action="submit"]');

////    // Validate form before submit
////    if (validator) {
////        validator.validate().then(function (status) {
////            if (status == 'Valid') {
////                var blockUI = new KTBlockUI(form, {
////                    overlayClass: "bg-danger bg-opacity-25",
////                    message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>من فضلك إنتظر ...</div>',
////                });
////                blockUI.block();
////                // Show loading indication
////                submitButton.setAttribute('data-kt-indicator', 'on');
////                // Disable button to avoid multiple click 
////                submitButton.disabled = true;

////                axios.post(form.action, new FormData(form))
////                    .then(function (response) {
////                        if (response.data.isValid) {
////                            swal.fire({
////                                title: response.data.title,
////                                text: response.data.message,
////                                icon: "success",
////                                showConfirmButton: false,
////                                timer: 1500
////                            }).then(function () {
////                                datatable.row.add(response.data.data).draw();
////                                // Hide loading indication
////                                submitButton.removeAttribute('data-kt-indicator');
////                                // Enable button
////                                submitButton.disabled = false;
////                                validator.resetForm(); // Reset formvalidation --- more info: https://formvalidation.io/guide/api/reset-form/
////                                form.reset(); // Reset form
////                                $('#kt_modal_add').modal('hide');
////                                blockUI.release();
////                            });
////                        } else {
////                            swal.fire({
////                                title: response.data.title,
////                                text: response.data.message,
////                                icon: "error",
////                                buttonsStyling: false,
////                                confirmButtonText: "موافق",
////                                customClass: {
////                                    confirmButton: "btn fw-bold btn-light-primary"
////                                }
////                            });
////                            // Hide loading indication
////                            submitButton.removeAttribute('data-kt-indicator');
////                            // Enable button
////                            submitButton.disabled = false;
////                            blockUI.release();
////                        }
////                    })
////                    .catch(function (error) {
////                        swal.fire({
////                            title: "المستخدمين",
////                            text: "من فضلك تأكد من تسجيل البيانات بطريقة صحيحة",
////                            icon: "error",
////                            buttonsStyling: false,
////                            confirmButtonText: "موافق",
////                            customClass: {
////                                confirmButton: "btn fw-bold btn-light-primary"
////                            }
////                        });
////                        // Hide loading indication
////                        submitButton.removeAttribute('data-kt-indicator');
////                        // Enable button
////                        submitButton.disabled = false;
////                        blockUI.release();
////                    });
////                blockUI.destroy();
////            } else {
////                KTUtil.scrollTop();
////            }
////        });
////    }
////    return false;
////}

//function EditGet(url) {
//    axios.get(url)
//        .then(function (response) {
//            $('#divModal').empty();
//            $('#divModal').html(response.data);
//            $('#kt_modal_edit').modal('show');
//        })  
//}

//function EditPost() {
//    const element = document.getElementById('kt_modal_edit');
//    const form = element.querySelector('#kt_modal_edit_form');

//    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
//    var validator = FormValidation.formValidation(
//        form,
//        {
//            fields: {
//                'branchID': {
//                    validators: {
//                        notEmpty: {
//                            message: 'تأكد من إختيار الفروع'
//                        }
//                    }
//                },
//                'userName': {
//                    validators: {
//                        notEmpty: {
//                            message: 'تأكد من تسجيل إسم المستخدم'
//                        }
//                    }
//                },
//                'password': {
//                    validators: {
//                        notEmpty: {
//                            message: 'تأكد من تسجيل كلمة المرور'
//                        }
//                    }
//                },
//            },

//            plugins: {
//                trigger: new FormValidation.plugins.Trigger(),
//                bootstrap: new FormValidation.plugins.Bootstrap5({
//                    rowSelector: '.row',
//                    eleInvalidClass: '',
//                    eleValidClass: ''
//                })
//            }
//        }
//    );
//    // Submit button handler
//    const submitButton = element.querySelector('[data-kt-modal-action="submit"]');

//    // Validate form before submit
//    if (validator) {
//            validator.validate().then(function (status) {
//                if (status == 'Valid') {                    
//                    var blockUI = new KTBlockUI(form, {
//                        overlayClass: "bg-danger bg-opacity-25",
//                        message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>من فضلك إنتظر ...</div>',
//                    });
//                    blockUI.block();
//                    // Show loading indication
//                    submitButton.setAttribute('data-kt-indicator', 'on');
//                    // Disable button to avoid multiple click 
//                    submitButton.disabled = true;

//                    axios.post(form.action, new FormData(form))
//                        .then(function (response) {
//                            if (response.data.isValid) {
//                                swal.fire({
//                                    title: response.data.title,
//                                    text: response.data.message,
//                                    icon: "success",
//                                    showConfirmButton: false,
//                                    timer: 1500
//                                }).then(function () {
//                                    datatable.row(rowIndex).data(response.data.data).draw();
//                                    // Hide loading indication
//                                    submitButton.removeAttribute('data-kt-indicator');
//                                    // Enable button
//                                    submitButton.disabled = false;
//                                    validator.resetForm(); // Reset formvalidation --- more info: https://formvalidation.io/guide/api/reset-form/
//                                    form.reset(); // Reset form
//                                    $('#kt_modal_edit').modal('hide');
//                                    blockUI.release();
//                                });
//                            } else {
//                                swal.fire({
//                                    title: response.data.title,
//                                    text: response.data.message,
//                                    icon: "error",
//                                    buttonsStyling: false,
//                                    confirmButtonText: "موافق",
//                                    customClass: {
//                                        confirmButton: "btn fw-bold btn-light-primary"
//                                    }
//                                });
//                                // Hide loading indication
//                                submitButton.removeAttribute('data-kt-indicator');
//                                // Enable button
//                                submitButton.disabled = false;
//                                blockUI.release();
//                            }
//                        })
//                        .catch(function (error) {
//                            swal.fire({
//                                title: "المستخدمين",
//                                text: "من فضلك تأكد من تسجيل البيانات بطريقة صحيحة",
//                                icon: "error",
//                                buttonsStyling: false,
//                                confirmButtonText: "موافق",
//                                customClass: {
//                                    confirmButton: "btn fw-bold btn-light-primary"
//                                }
//                            });
//                            // Hide loading indication
//                            submitButton.removeAttribute('data-kt-indicator');
//                            // Enable button
//                            submitButton.disabled = false;
//                            blockUI.release();
//                        });
//                    blockUI.destroy();
//                } else {
//                    KTUtil.scrollTop();
//                }
//            });
//    }
//    return false;
//}

//function Delete(url) {

//    Swal.fire({
//        title: "هل انت متأكد ؟",
//        text: "سيتم حذف المستخدم",
//        icon: "warning",
//        showCancelButton: true,
//        buttonsStyling: false,
//        confirmButtonText: "موافق",
//        cancelButtonText: "الغاء",
//        customClass: {
//            confirmButton: "btn fw-bold btn-danger",
//            cancelButton: "btn fw-bold btn-active-light-primary"
//        }
//    }).then(function (result) {
//        if (result.value) {

//            axios.post(url)
//                .then(function (response) {
//                    if (response.data.isValid) {
//                        swal.fire({
//                            title: response.data.title,
//                            text: response.data.message,
//                            icon: "success",
//                            showConfirmButton: false,
//                            timer: 1500
//                        }).then(function () {
//                            // Remove current row
//                            datatable.row(rowIndex).remove().draw();
//                            $('#kt_modal_edit').modal('hide');
//                        });
//                    } else {
//                        swal.fire({
//                            title: response.data.title,
//                            text: response.data.message,
//                            icon: "error",
//                            buttonsStyling: false,
//                            confirmButtonText: "موافق",
//                            customClass: {
//                                confirmButton: "btn fw-bold btn-light-primary"
//                            }
//                        });
//                    }
//                })
//                .catch(function (error) {
//                    swal.fire({
//                        title: "المستخدمين",
//                        text: "من فضلك تأكد من تسجيل البيانات بطريقة صحيحة",
//                        icon: "error",
//                        buttonsStyling: false,
//                        confirmButtonText: "موافق",
//                        customClass: {
//                            confirmButton: "btn fw-bold btn-light-primary"
//                        }
//                    });
//                });
//        }
//    });

//    return false;
//}