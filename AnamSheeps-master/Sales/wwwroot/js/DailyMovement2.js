"use strict";
var movementDataTable;
var salesDataTable;
var expensesDataTable;
var suppliersDataTable;
var customersDataTable;
var taslimDataTable;
var waridDataTable;
var rowIndex;

// Initialize Movement Table (Purchases)
function initMovementTable() {
    const table = document.getElementById('movementTable');

    movementDataTable = $(table).DataTable({
        responsive: true,
        processing: true,
        searching: false,
        paging: false,
        info: false,
        //"ajax": {
        //    "url": "/DailyMovement/"
        //},
        //data: [],
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
            }
        },
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "الكل"]],
        "pageLength": 50,
        fixedHeader: { header: true },
        'order': [],
        'columnDefs': [
            { targets: [0, 7], orderable: false, searchable: false, className: "text-center" },
            { targets: [2, 3, 4], className: "text-center" }
        ],
        "columns": [
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                "data": "productId",
                "render": function (data, type, row) {
                    let options = window.productsHTML || '<option value="">اختر الصنف</option>';
                    return `<select class="form-select form-select-sm product-select select-arrow-left" data-row-id="${row.id || ''}">
                                ${options}
                            </select>`;
                }
            },
            {
                "data": "quantity",
                "render": function (data) {
                    return `<input type="number" class="form-control form-control-sm text-center quantity-input" 
                                   min="0" value="${data || 0}" />`;
                }
            },
            {
                "data": "price",
                "render": function (data) {
                    return `<input type="number" step="1" class="form-control form-control-sm text-center price-input" 
                                   min="0" value="${data || 0}" />`;
                }
            },
            {
                "data": "total",
                "render": function (data) {
                    return `<input type="number" step="1" class="form-control form-control-sm text-center total-input" 
                                   min="0" value="${data || 0}" readonly />`;
                }
            },
            {
                "data": "paymentType",
                "render": function (data) {
                    return `<select class="form-select form-select-sm payment-type">
                                <option value="نقدا" ${data === 'نقدا' ? 'selected' : ''}>نقدا</option>
                                <option value="آجل" ${data === 'آجل' ? 'selected' : ''}>آجل</option>
                                <option value="تحويل" ${data === 'تحويل' ? 'selected' : ''}>تحويل</option>
                            </select>`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<input type="text" class="form-control form-control-sm notes-input" value="${data || ''}" />`;
                }
            },
            {
                "data": null,
                "render": function () {
                    return `<button type="button" class="btn btn-sm btn-danger btn-icon" onclick="deleteMovementRow(this)">
                                <i class="fa-solid fa-trash"></i>
                            </button>`;
                }
            }
        ],
        "drawCallback": function () {
            initializeChoicesForSelects();
            attachMovementRowEvents();
            calculateTotals();
        }
    });
}

// Initialize Sales Table
function initSalesTable() {
    const table = document.getElementById('salesTable');

    salesDataTable = $(table).DataTable({
        responsive: true,
        processing: true,
        searching: false,
        paging: false,
        info: false,
        "language": {
            "search": "البحث ",
            "emptyTable": "لا توجد بيانات",
            "lengthMenu": "عرض _MENU_",
            "paginate": {
                "first": "الأول",
                "last": "الأخير",
                "next": "التالى",
                "previous": "السابق"
            }
        },
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
        "pageLength": 50,
        'order': [],
        'columnDefs': [
            { targets: [0, 7], orderable: false, className: "text-center" }
        ],
        "columns": [
            { "data": null, "render": function (data, type, row, meta) { return meta.row + 1; } },
            {
                "data": "productId",
                "render": function (data) {
                    return `<select class="form-select form-select-sm sales-product-select">${window.productsHTML}</select>`;
                }
            },
            { "data": "quantity", "render": function (data) { return `<input type="number" class="form-control form-control-sm text-center sales-quantity-input" min="0" value="${data || ''}" />`; } },
            { "data": "price", "render": function (data) { return `<input type="number" step="1" class="form-control form-control-sm text-center sales-price-input" min="0" value="${data || ''}" />`; } },
            { "data": "total", "render": function (data) { return `<input type="number" step="1" class="form-control form-control-sm text-center sales-total-input" min="0" value="${data || 0}" readonly />`; } },
            {
                "data": "paymentType",
                "render": function (data) {
                    return `<select class="form-select form-select-sm sales-payment-type">
                                <option value="نقدا" ${data === 'نقدا' ? 'selected' : ''}>نقدا</option>
                                <option value="آجل" ${data === 'آجل' ? 'selected' : ''}>آجل</option>
                                <option value="تحويل" ${data === 'تحويل' ? 'selected' : ''}>تحويل</option>
                                <option value="تمويل" ${data === 'تمويل' ? 'selected' : ''}>تمويل</option>
                            </select>`;
                }
            },
            { "data": "notes", "render": function (data) { return `<input type="text" class="form-control form-control-sm sales-notes-input" value="${data || ''}" />`; } },
            { "data": null, "render": function () { return `<button type="button" class="btn btn-sm btn-danger" onclick="deleteSalesRow(this)"><i class="fa-solid fa-trash"></i></button>`; } }
        ],
        "drawCallback": function () {
            initializeChoicesForSelects();
            attachSalesRowEvents();
            calculateSalesTotals();
        }
    });
}

// Initialize Expenses Table
function initExpensesTable() {
    const table = document.getElementById('expensesTable');

    expensesDataTable = $(table).DataTable({
        responsive: true,
        searching: false,
        paging: false,
        info: false,
        "language": { "search": "البحث ", "emptyTable": "لا توجد بيانات" },
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
        "pageLength": 50,
        'order': [],
        "columns": [
            { "data": null, "render": function (data, type, row, meta) { return meta.row + 1; } },
            {
                "data": "categoryId",
                "render": function (data) {
                    return `<select class="form-select form-select-sm expense-category-select">${window.categoriesHTML}</select>`;
                }
            },
            { "data": "quantity", "render": function (data) { return `<input type="number" class="form-control form-control-sm text-center expense-quantity-input" min="0" value="${data || ''}" />`; } },
            { "data": "amount", "render": function (data) { return `<input type="number" step="1" class="form-control form-control-sm text-center expense-amount-input" min="0" value="${data || ''}" />`; } },
            { "data": "total", "render": function (data) { return `<input type="number" step="1" class="form-control form-control-sm text-center expense-total-input" min="0" value="${data || ''}" readonly />`; } },
            { "data": "notes", "render": function (data) { return `<input type="text" class="form-control form-control-sm expense-notes-input" value="${data || ''}" />`; } },
            { "data": null, "render": function () { return `<button type="button" class="btn btn-sm btn-danger" onclick="deleteExpenseRow(this)"><i class="fa-solid fa-trash"></i></button>`; } }
        ],
        "drawCallback": function () {
            initializeChoicesForSelects();
            attachExpenseRowEvents();
            calculateExpenseTotals();
        }
    });
}

// Initialize Suppliers Table
function initSuppliersTable() {
    const table = document.getElementById('suppliersTable');

    suppliersDataTable = $(table).DataTable({
        responsive: true,
        searching: false,
        paging: false,
        info: false,
        "language": { "search": "البحث ", "emptyTable": "لا توجد بيانات" },
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
        "pageLength": 50,
        'order': [],
        "columns": [
            { "data": null, "render": function (data, type, row, meta) { return meta.row + 1; } },
            {
                "data": "supplierId",
                "render": function (data) {
                    return `<select class="form-select form-select-sm supplier-select">${window.suppliersHTML}</select>`;
                }
            },
            { "data": "amount", "render": function (data) { return `<input type="number" step="1" class="form-control form-control-sm text-center supplier-amount-input" min="0" value="${data || ''}" />`; } },
            { "data": "notes", "render": function (data) { return `<input type="text" class="form-control form-control-sm supplier-notes-input" value="${data || ''}" />`; } },
            { "data": null, "render": function () { return `<button type="button" class="btn btn-sm btn-danger" onclick="deleteSupplierRow(this)"><i class="fa-solid fa-trash"></i></button>`; } }
        ],
        "drawCallback": function () {
            initializeChoicesForSelects();
            attachSupplierRowEvents();
            calculateSupplierTotals();
        }
    });
}

// Initialize Customers Table
function initCustomersTable() {
    const table = document.getElementById('customersTable');

    customersDataTable = $(table).DataTable({
        responsive: true,
        searching: false,
        paging: false,
        info: false,
        "language": { "search": "البحث ", "emptyTable": "لا توجد بيانات" },
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
        "pageLength": 50,
        'order': [],
        "columns": [
            { "data": null, "render": function (data, type, row, meta) { return meta.row + 1; } },
            {
                "data": "customerId",
                "render": function (data) {
                    return `<select class="form-select form-select-sm customer-select">${window.customersHTML}</select>`;
                }
            },
            { "data": "amount", "render": function (data) { return `<input type="number" step="0.01" class="form-control form-control-sm text-center customer-amount-input" min="0" value="${data || ''}" />`; } },
            { "data": "notes", "render": function (data) { return `<input type="text" class="form-control form-control-sm customer-notes-input" value="${data || ''}" />`; } },
            { "data": null, "render": function () { return `<button type="button" class="btn btn-sm btn-danger" onclick="deleteCustomerRow(this)"><i class="fa-solid fa-trash"></i></button>`; } }
        ],
        "drawCallback": function () {
            initializeChoicesForSelects();
            attachCustomerRowEvents();
            calculateCustomerTotals();
        }
    });
}

// Initialize Taslim Table
function initTaslimTable() {
    const table = document.getElementById('taslimTable');

    taslimDataTable = $(table).DataTable({
        responsive: true,
        searching: false,
        paging: false,
        info: false,
        "language": { "search": "البحث ", "emptyTable": "لا توجد بيانات" },
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
        "pageLength": 50,
        'order': [],
        "columns": [
            { "data": null, "render": function (data, type, row, meta) { return meta.row + 1; } },
            {
                "data": "receiver",
                "render": function (data) {
                    return `<input type="text" class="form-control form-control-sm taslim-receiver-input" value="${data || ''}" placeholder="اسم المستلم" />`;
                }
            },
            {
                "data": "amount",
                "render": function (data) {
                    return `<input type="number" step="1" class="form-control form-control-sm text-center taslim-amount-input" min="0" value="${data || ''}" />`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<input type="text" class="form-control form-control-sm taslim-notes-input" value="${data || ''}" />`;
                }
            },
            {
                "data": null,
                "render": function () {
                    return `<button type="button" class="btn btn-sm btn-danger" onclick="deleteTaslimRow(this)"><i class="fa-solid fa-trash"></i></button>`;
                }
            }
        ],
        "drawCallback": function () {
            attachTaslimRowEvents();
            calculateTaslimTotals();
        }
    });
}

// Initialize Warid Table
function initWaridTable() {
    const table = document.getElementById('waridTable');

    waridDataTable = $(table).DataTable({
        responsive: true,
        searching: false,
        paging: false,
        info: false,
        "language": { "search": "البحث ", "emptyTable": "لا توجد بيانات" },
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
        "pageLength": 50,
        'order': [],
        "columns": [
            { "data": null, "render": function (data, type, row, meta) { return meta.row + 1; } },
            {
                "data": "receiver",
                "render": function (data) {
                    return `<input type="text" class="form-control form-control-sm warid-receiver-input" value="${data || ''}" placeholder="اسم الشخص" />`;
                }
            },
            {
                "data": "amount",
                "render": function (data) {
                    return `<input type="number" step="1" class="form-control form-control-sm text-center warid-amount-input" min="0" value="${data || ''}" />`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<input type="text" class="form-control form-control-sm warid-notes-input" value="${data || ''}" />`;
                }
            },
            {
                "data": null,
                "render": function () {
                    return `<button type="button" class="btn btn-sm btn-danger" onclick="deleteWaridRow(this)"><i class="fa-solid fa-trash"></i></button>`;
                }
            }
        ],
        "drawCallback": function () {
            attachWaridRowEvents();
            calculateWaridTotals();
        }
    });
}

// Add New Row Functions
function addNewRow() {
    if (!window.productsHTML || window.productsHTML.trim() === '') {
        Swal.fire({
            title: 'خطأ',
            text: 'لا توجد أصناف متاحة',
            icon: 'error'
        });
        return;
    }

    const newRowData = {
        id: null,
        productId: null,
        quantity: 0,
        price: 0,
        total: 0,
        paymentType: 'نقدا',
        notes: ''
    };

    movementDataTable.row.add(newRowData).draw(false);

}

function addNewSalesRow() {
    const newRowData = {
        id: null,
        productId: null,
        quantity: 0,
        price: 0,
        total: 0,
        paymentType: 'نقدا',
        notes: ''
    };

    salesDataTable.row.add(newRowData).draw(false);
}

function addNewExpenseRow() {
    if (!window.categoriesHTML || window.categoriesHTML.trim() === '') {
        Swal.fire({ title: 'خطأ', text: 'لا توجد بنود متاحة', icon: 'error' });
        return;
    }

    const newRowData = {
        id: null,
        categoryId: null,
        quantity: 0,
        amount: 0,
        total: 0,
        notes: ''
    };

    expensesDataTable.row.add(newRowData).draw(false);
}

function addNewSupplierRow() {
    if (!window.suppliersHTML || window.suppliersHTML.trim() === '') {
        Swal.fire({ title: 'خطأ', text: 'لا توجد موردين متاحين', icon: 'error' });
        return;
    }

    const newRowData = {
        id: null,
        supplierId: null,
        amount: 0,
        notes: ''
    };

    suppliersDataTable.row.add(newRowData).draw(false);
}

function addNewCustomerRow() {
    if (!window.customersHTML || window.customersHTML.trim() === '') {
        Swal.fire({ title: 'خطأ', text: 'لا توجد عملاء متاحين', icon: 'error' });
        return;
    }

    const newRowData = {
        id: null,
        customerId: null,
        amount: 0,
        notes: ''
    };

    customersDataTable.row.add(newRowData).draw(false);
}

function addNewTaslimRow() {
    const newRowData = {
        id: null,
        receiver: '',
        amount: 0,
        notes: ''
    };
    taslimDataTable.row.add(newRowData).draw(false);
}
function addNewWaridRow() {
    const newRowData = {
        id: null,
        receiver: '',
        amount: 0,
        notes: ''
    };
    waridDataTable.row.add(newRowData).draw(false);
}


// Delete Row Functions
function deleteMovementRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف هذا البند",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const row = $(button).closest('tr');
            movementDataTable.row(row).remove().draw(false);
            calculateTotals();
        }
    });
}

function deleteSalesRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            const row = $(button).closest('tr');
            salesDataTable.row(row).remove().draw(false);
            calculateSalesTotals();
        }
    });
}

function deleteExpenseRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف'
    }).then((result) => {
        if (result.isConfirmed) {
            expensesDataTable.row($(button).closest('tr')).remove().draw(false);
            calculateExpenseTotals();
        }
    });
}

function deleteSupplierRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف'
    }).then((result) => {
        if (result.isConfirmed) {
            suppliersDataTable.row($(button).closest('tr')).remove().draw(false);
            calculateSupplierTotals();
        }
    });
}

function deleteCustomerRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف'
    }).then((result) => {
        if (result.isConfirmed) {
            customersDataTable.row($(button).closest('tr')).remove().draw(false);
            calculateCustomerTotals();
        }
    });
}

function deleteTaslimRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف'
    }).then((result) => {
        if (result.isConfirmed) {
            taslimDataTable.row($(button).closest('tr')).remove().draw(false);
            calculateTaslimTotals();
        }
    });
}

function deleteWaridRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف'
    }).then((result) => {
        if (result.isConfirmed) {
            waridDataTable.row($(button).closest('tr')).remove().draw(false);
            calculateWaridTotals();
        }
    });
}


// Initialize Choices.js for all selects

function initializeChoicesForSelects() {

    document.querySelectorAll('select:not(.choices__input)').forEach(function (el) {
        if (!el.classList.contains('choices-initialized')) {
            new Choices(el, {
                searchEnabled: true,
                itemSelectText: '',
                placeholderValue: 'اختر...',
                searchPlaceholderValue: 'اكتب للبحث...',
                shouldSort: false,
                position: 'bottom',
                searchResultLimit: 10,
                noResultsText: 'لا توجد نتائج',
                noChoicesText: 'لا توجد عناصر',
                dir: 'rtl'
            });
            el.classList.add('choices-initialized');
        }
    });
}

// Event Handlers & Calculations

function attachMovementRowEvents() {
    $('.product-select').off('change').on('change', function () {
        const selectedOption = $(this).find('option:selected');
        const price = parseFloat(selectedOption.data('price')) || 0;
        const row = $(this).closest('tr');
        row.find('.price-input').val(price.toFixed(2));
        calculateRowTotal(row);
    });

    $('.quantity-input, .price-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.quantity-input').val()) || 0;
        const price = parseFloat(row.find('.price-input').val()) || 0;
        row.find('.total-input').val((quantity * price).toFixed(2));
        calculateTotals();
    });

    $('.total-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.quantity-input').val()) || 0;
        const total = parseFloat($(this).val()) || 0;
        if (quantity > 0) {
            row.find('.price-input').val((total / quantity).toFixed(2));
        }
        calculateTotals();
    });

    $('.payment-type').off('change').on('change', calculateTotals);
}

function attachSalesRowEvents() {
    $('.sales-product-select').off('change').on('change', function () {
        const price = parseFloat($(this).find('option:selected').data('price')) || 0;
        const row = $(this).closest('tr');
        row.find('.sales-price-input').val(price.toFixed(2));
        const quantity = parseFloat(row.find('.sales-quantity-input').val()) || 0;
        row.find('.sales-total-input').val((quantity * price).toFixed(2));
        calculateSalesTotals();
    });

    $('.sales-quantity-input, .sales-price-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.sales-quantity-input').val()) || 0;
        const price = parseFloat(row.find('.sales-price-input').val()) || 0;
        row.find('.sales-total-input').val((quantity * price).toFixed(2));
        calculateSalesTotals();
    });

    $('.sales-payment-type').off('change').on('change', calculateSalesTotals);
}

function attachExpenseRowEvents() {
    $('.expense-quantity-input, .expense-amount-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.expense-quantity-input').val()) || 0;
        const amount = parseFloat(row.find('.expense-amount-input').val()) || 0;
        row.find('.expense-total-input').val((quantity * amount).toFixed(2));
        calculateExpenseTotals();
    });
}

function attachSupplierRowEvents() {
    $('.supplier-amount-input').off('input').on('input', calculateSupplierTotals);
}

function attachCustomerRowEvents() {
    $('.customer-amount-input').off('input').on('input', calculateCustomerTotals);
}

function attachTaslimRowEvents() {
    $('#taslimTable').off('input', '.taslim-amount-input').on('input', '.taslim-amount-input', function () {
        calculateTaslimTotals();
    });
}

function attachWaridRowEvents() {
    $('#waridTable').off('input', '.warid-amount-input').on('input', '.warid-amount-input', function () {
        calculateWaridTotals();
    });
}


// Calculate Totals
function calculateRowTotal(row) {
    const quantity = parseFloat(row.find('.quantity-input').val()) || 0;
    const price = parseFloat(row.find('.price-input').val()) || 0;
    row.find('.total-input').val((quantity * price).toFixed(2));
    calculateTotals();
}

function calculateTotals() {
    let totalQuantity = 0, grandTotal = 0, totalCredit = 0, totalCash = 0;
    let cashQuantity = 0, creditQuantity = 0;

    $('#movementTable tbody tr').each(function () {
        const quantity = parseFloat($(this).find('.quantity-input').val()) || 0;
        const total = parseFloat($(this).find('.total-input').val()) || 0;
        const paymentType = $(this).find('.payment-type').val();

        totalQuantity += quantity;
        grandTotal += total;

        if (paymentType === 'آجل') {
            totalCredit += total;
            creditQuantity += quantity;
        } else if (paymentType === 'نقدا') {
            totalCash += total;
            cashQuantity += quantity;
        }
    });

    $('#totalQuantity').text(totalQuantity);
    $('#grandTotal').text(grandTotal.toFixed(2));
    $('#totalCredit').text(totalCredit.toFixed(2));
    $('#totalCash').text(totalCash.toFixed(2));
    $('#cashQuantity').text(cashQuantity);
    $('#creditQuantity').text(creditQuantity);

    calculateBalanceTotals();
}

function calculateSalesTotals() {
    let totalQuantity = 0, grandTotal = 0, totalCredit = 0, totalCash = 0;
    let cashQuantity = 0, creditQuantity = 0;

    $('#salesTable tbody tr').each(function () {
        const quantity = parseFloat($(this).find('.sales-quantity-input').val()) || 0;
        const total = parseFloat($(this).find('.sales-total-input').val()) || 0;
        const paymentType = $(this).find('.sales-payment-type').val();

        totalQuantity += quantity;
        grandTotal += total;

        if (paymentType === 'آجل') {
            totalCredit += total;
            creditQuantity += quantity;
        } else if (paymentType === 'نقدا') {
            totalCash += total;
            cashQuantity += quantity;
        }
    });

    $('#salesTotalQuantity').text(totalQuantity);
    $('#salesGrandTotal').text(grandTotal.toFixed(2));
    $('#salesTotalCredit').text(totalCredit.toFixed(2));
    $('#salesTotalCash').text(totalCash.toFixed(2));
    $('#salesCashQuantity').text(cashQuantity);
    $('#salesCreditQuantity').text(creditQuantity);

    calculateBalanceTotals();
}

function calculateExpenseTotals() {
    let totalQuantity = 0, grandTotal = 0;

    $('#expensesTable tbody tr').each(function () {
        const quantity = parseFloat($(this).find('.expense-quantity-input').val()) || 0;
        const total = parseFloat($(this).find('.expense-total-input').val()) || 0;
        totalQuantity += quantity;
        grandTotal += total;
    });

    $('#totalExpenseQuantity').text(totalQuantity);
    $('#grandTotalExpenses').text(grandTotal.toFixed(2));
    calculateBalanceTotals();
}

function calculateSupplierTotals() {
    let grandTotal = 0;
    $('#suppliersTable tbody tr').each(function () {
        grandTotal += parseFloat($(this).find('.supplier-amount-input').val()) || 0;
    });
    $('#grandTotalSuppliers').text(grandTotal.toFixed(2));
    calculateBalanceTotals();
}

function calculateCustomerTotals() {
    let grandTotal = 0;
    $('#customersTable tbody tr').each(function () {
        grandTotal += parseFloat($(this).find('.customer-amount-input').val()) || 0;
    });
    $('#grandTotalCustomers').text(grandTotal.toFixed(2));
    calculateBalanceTotals();
}

function updateBalanceFromTaslimWarid() {
    let taslimTotal = 0;
    taslimDataTable.rows().every(function () {
        const rowNode = this.node();
        const amount = parseFloat($(rowNode).find('.taslim-amount-input').val()) || 0;
        taslimTotal += amount;
    });

    let waridTotal = 0;
    waridDataTable.rows().every(function () {
        const rowNode = this.node();
        const amount = parseFloat($(rowNode).find('.warid-amount-input').val()) || 0;
        waridTotal += amount;
    });

    const mablaghWaridRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد من الإدارة +"]');
    const mablaghMashubRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ مسحوب تسليم للإدارة -"]');

    mablaghWaridRow.find('.balance-amount-input').val(waridTotal.toFixed(2));
    mablaghMashubRow.find('.balance-amount-input').val(taslimTotal.toFixed(2));

    calculateBalanceTotals();
}

function calculateTaslimTotals() {
    let grandTotal = 0;
    taslimDataTable.rows().every(function () {
        const rowNode = this.node();
        grandTotal += parseFloat($(rowNode).find('.taslim-amount-input').val()) || 0;
    });
    $('#grandTotalTaslim').text(grandTotal.toFixed(2));
    updateBalanceFromTaslimWarid();
}

function calculateWaridTotals() {
    let grandTotal = 0;
    waridDataTable.rows().every(function () {
        const rowNode = this.node();
        grandTotal += parseFloat($(rowNode).find('.warid-amount-input').val()) || 0;
    });
    $('#grandTotalWarid').text(grandTotal.toFixed(2));
    updateBalanceFromTaslimWarid();
}
function calculateBalanceTotals() {
    const rasidSabiqRow = $('#balancesTable tbody tr.balance-row[data-type="رصيد سابق"]');
    const rasidSabiq = parseFloat(rasidSabiqRow.find('.balance-amount-input').val()) || 0;

    let cashSales = 0;
    $('#salesTable tbody tr').each(function () {
        const paymentType = $(this).find('.sales-payment-type').val();
        const total = parseFloat($(this).find('.sales-total-input').val()) || 0;
        if (paymentType === 'نقدا') {
            cashSales += total;
        }
    });

    let customerPayments = 0;
    $('#customersTable tbody tr').each(function () {
        const amount = parseFloat($(this).find('.customer-amount-input').val()) || 0;
        customerPayments += amount;
    });

    // ✅ وارد من الإدارة (من الجدول الجديد):
    let waridAmount = 0;
    $('#waridTable tbody tr').each(function () {
        const amount = parseFloat($(this).find('.warid-amount-input').val()) || 0;
        waridAmount += amount;
    });

    let cashPurchases = 0;
    $('#movementTable tbody tr').each(function () {
        const paymentType = $(this).find('.payment-type').val();
        const total = parseFloat($(this).find('.total-input').val()) || 0;
        if (paymentType === 'نقدا') {
            cashPurchases += total;
        }
    });

    let supplierPayments = 0;
    $('#suppliersTable tbody tr').each(function () {
        const amount = parseFloat($(this).find('.supplier-amount-input').val()) || 0;
        supplierPayments += amount;
    });

    // ✅ تسليم للإدارة (من الجدول الجديد):
    let taslimAmount = 0;
    $('#taslimTable tbody tr').each(function () {
        const amount = parseFloat($(this).find('.taslim-amount-input').val()) || 0;
        taslimAmount += amount;
    });

    const totalExpenses = parseFloat($('#grandTotalExpenses').text()) || 0;

    // Update balance rows
    const salesRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد من المبيعات +"]');
    salesRow.find('.balance-amount-input').val(cashSales.toFixed(2));

    const customerPaymentsRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد سداد عميل +"]');
    customerPaymentsRow.find('.balance-amount-input').val(customerPayments.toFixed(2));

    const mablaghWaridRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد من الإدارة +"]');
    mablaghWaridRow.find('.balance-amount-input').val(waridAmount.toFixed(2));

    const purchasesRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ صادر مشتريات -"]');
    purchasesRow.find('.balance-amount-input').val(cashPurchases.toFixed(2));

    const supplierPaymentsRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ صادر سداد وارد -"]');
    supplierPaymentsRow.find('.balance-amount-input').val(supplierPayments.toFixed(2));

    const mablaghMashubRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ مسحوب تسليم للإدارة -"]');
    mablaghMashubRow.find('.balance-amount-input').val(taslimAmount.toFixed(2));

    const totalExpensesRow = $('#balancesTable tbody tr.balance-row[data-type="إجمالي المصروفات -"]');
    totalExpensesRow.find('.balance-amount-input').val(totalExpenses.toFixed(2));

    const totalPlus = cashSales + customerPayments + waridAmount;
    const totalMinus = cashPurchases + supplierPayments + taslimAmount + totalExpenses;

    const availableBalance = rasidSabiq + totalPlus - totalMinus;
    $('#availableBalance').text(availableBalance.toFixed(2));

    let cell = $('#availableBalance');
    cell.removeClass('balance-positive balance-negative');

    if (availableBalance > 0) {
        cell.addClass('balance-positive');
    } else if (availableBalance < 0) {
        cell.addClass('balance-negative');
    }

    return availableBalance;
}

// ============================================
// Initialize on Document Ready
// ============================================

$(document).ready(function () {
    initMovementTable();
    initSalesTable();
    initExpensesTable();
    initSuppliersTable();
    initCustomersTable();
    initTaslimTable();
    initWaridTable();

    // Load initial data
    calculateTotals();
    calculateSalesTotals();
    calculateExpenseTotals();
    calculateSupplierTotals();
    calculateCustomerTotals();
    calculateTaslimTotals();
    calculateWaridTotals();
    calculateBalanceTotals();
});

// ============================================
// Save Movement Function
// ============================================

function saveMovement() {
    const details = [];
    const sales = [];
    const expenses = [];
    const suppliers = [];
    const customers = [];
    const taslim = [];
    const warid = [];
    //const withdrawals = [];
    const balances = [];
    let isValid = true;

    // ✅ جمع بيانات المبيعات من DataTable
    salesDataTable.rows().every(function () {
        const rowData = this.data();
        const rowNode = this.node();

        const productId = $(rowNode).find('.sales-product-select').val();
        const quantity = parseFloat($(rowNode).find('.sales-quantity-input').val()) || 0;
        const price = parseFloat($(rowNode).find('.sales-price-input').val()) || 0;
        const total = parseFloat($(rowNode).find('.sales-total-input').val()) || 0;
        const paymentType = $(rowNode).find('.sales-payment-type').val();
        const notes = $(rowNode).find('.sales-notes-input').val();

        if (!productId || quantity <= 0) {
            isValid = false;
            return false;
        }

        sales.push({
            DailyMovementSales_ProductID: parseInt(productId),
            DailyMovementSales_Quantity: quantity,
            DailyMovementSales_Price: price,
            DailyMovementSales_Total: total,
            DailyMovementSales_PaymentType: paymentType,
            DailyMovementSales_Notes: notes
        });
    });

    if (!isValid) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك تحقق من بيانات المبيعات',
            icon: 'warning',
            confirmButtonText: 'موافق'
        });
        return;
    }

    // ✅ جمع بيانات المشتريات من DataTable
    movementDataTable.rows().every(function () {
        const rowNode = this.node();

        const productId = $(rowNode).find('.product-select').val();
        const quantity = parseFloat($(rowNode).find('.quantity-input').val()) || 0;
        const price = parseFloat($(rowNode).find('.price-input').val()) || 0;
        const total = parseFloat($(rowNode).find('.total-input').val()) || 0;
        const paymentType = $(rowNode).find('.payment-type').val();
        const notes = $(rowNode).find('.notes-input').val();

        if (!productId) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك اختر الصنف في جميع صفوف المشتريات',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        if (quantity <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل العدد بشكل صحيح في المشتريات',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        details.push({
            DailyMovementDetails_ProductID: parseInt(productId),
            DailyMovementDetails_Quantity: quantity,
            DailyMovementDetails_Price: price,
            DailyMovementDetails_Total: total,
            DailyMovementDetails_PaymentType: paymentType,
            DailyMovementDetails_Notes: notes
        });
    });

    if (!isValid) return;

    // ✅ جمع بيانات المصروفات من DataTable
    expensesDataTable.rows().every(function () {
        const rowNode = this.node();

        const categoryId = $(rowNode).find('.expense-category-select').val();
        const quantity = parseFloat($(rowNode).find('.expense-quantity-input').val()) || 0;
        const amount = parseFloat($(rowNode).find('.expense-amount-input').val()) || 0;
        const total = parseFloat($(rowNode).find('.expense-total-input').val()) || 0;
        const notes = $(rowNode).find('.expense-notes-input').val();

        if (!categoryId) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك اختر البند في جميع صفوف المصروفات',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        if (quantity <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل العدد بشكل صحيح في المصروفات',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        expenses.push({
            DailyMovementExpense_CategoryID: parseInt(categoryId),
            DailyMovementExpense_Quantity: quantity,
            DailyMovementExpense_Amount: amount,
            DailyMovementExpense_Total: total,
            DailyMovementExpense_Notes: notes
        });
    });

    if (!isValid) return;

    // ✅ جمع بيانات الموردين من DataTable
    suppliersDataTable.rows().every(function () {
        const rowNode = this.node();

        const supplierId = $(rowNode).find('.supplier-select').val();
        const amount = parseFloat($(rowNode).find('.supplier-amount-input').val()) || 0;
        const notes = $(rowNode).find('.supplier-notes-input').val();

        if (!supplierId) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك اختر المورد في جميع الصفوف',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        if (amount <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل المبلغ بشكل صحيح',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        suppliers.push({
            DailyMovementSupplier_SupplierID: parseInt(supplierId),
            DailyMovementSupplier_Amount: amount,
            DailyMovementSupplier_Notes: notes
        });
    });

    if (!isValid) return;

    // ✅ جمع بيانات العملاء من DataTable
    customersDataTable.rows().every(function () {
        const rowNode = this.node();

        const customerId = $(rowNode).find('.customer-select').val();
        const amount = parseFloat($(rowNode).find('.customer-amount-input').val()) || 0;
        const notes = $(rowNode).find('.customer-notes-input').val();

        if (!customerId) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك اختر العميل في جميع الصفوف',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        if (amount <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل المبلغ بشكل صحيح للعميل',
                icon: 'warning'
            });
            isValid = false;
            return false;
        }

        customers.push({
            DailyMovementCustomer_CustomerID: parseInt(customerId),
            DailyMovementCustomer_Amount: amount,
            DailyMovementCustomer_Notes: notes
        });
    });

    if (!isValid) return;

    taslimDataTable.rows().every(function () {
        const rowNode = this.node();

        const receiver = $(rowNode).find('.taslim-receiver-input').val();
        const amount = parseFloat($(rowNode).find('.taslim-amount-input').val()) || 0;
        const notes = $(rowNode).find('.taslim-notes-input').val();

        if (amount > 0) {
            taslim.push({
                DailyMovementTaslim_Receiver: receiver,
                DailyMovementTaslim_Amount: amount,
                DailyMovementTaslim_Notes: notes
            });
        }
    });

    // ✅ جمع بيانات وارد من الإدارة
    waridDataTable.rows().every(function () {
        const rowNode = this.node();

        const receiver = $(rowNode).find('.warid-receiver-input').val();
        const amount = parseFloat($(rowNode).find('.warid-amount-input').val()) || 0;
        const notes = $(rowNode).find('.warid-notes-input').val();

        if (amount > 0) {
            warid.push({
                DailyMovementWarid_Receiver: receiver,
                DailyMovementWarid_Amount: amount,
                DailyMovementWarid_Notes: notes
            });
        }
    });

    // ✅ جمع بيانات الرصيد (من جدول عادي، مش DataTable)
    $('#balancesTable tbody tr.balance-row').each(function () {
        const type = $(this).data('type');
        const amount = parseFloat($(this).find('.balance-amount-input').val()) || 0;
        const notes = $(this).find('.balance-notes-input').val();

        if (amount > 0) {
            balances.push({
                DailyMovementBalance_Type: type,
                DailyMovementBalance_Amount: amount,
                DailyMovementBalance_Notes: notes
            });
        }
    });

    const data = {
        Details: details,
        Sales: sales,
        Expenses: expenses,
        Suppliers: suppliers,
        Customers: customers,
        Taslim: taslim,
        Warid: warid,
        //Withdrawals: withdrawals,
        Balances: balances
    };

    // Show loading
    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    axios.post('/DailyMovement/SaveMovement', data)
        .then(function (response) {
            if (response.data.isValid) {
                Swal.fire({
                    title: response.data.title,
                    text: response.data.message,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                }).then(function () {
                    location.reload();
                });
            } else {
                Swal.fire({
                    title: response.data.title,
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'موافق',
                    customClass: {
                        confirmButton: 'btn fw-bold btn-primary'
                    }
                });
            }
        })
        .catch(function (error) {
            Swal.fire({
                title: 'خطأ',
                text: 'حدث خطأ أثناء الحفظ',
                icon: 'error',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
        });
}

// ============================================
// Quick Add Functions
// ============================================

function saveQuickProduct() {
    const name = $('#newProductName').val().trim();
    const price = parseFloat($('#newProductPrice').val()) || 0;

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم الصنف',
            icon: 'warning'
        });
        return;
    }

    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const data = {
        Product_Name: name,
        Product_Price: price
    };

    axios.post('/DailyMovement/QuickAddProduct', data)
        .then(function (response) {
            if (response.data.isValid) {
                // تحديث قائمة المنتجات
                const newProduct = response.data.data;
                const newOption = `<option value="${newProduct.product_ID}" data-price="${newProduct.product_Price}">${newProduct.product_Name}</option>`;

                // إضافة للـ HTML العام
                window.productsHTML += newOption;

                // تحديث كل select في الجداول
                $('.product-select, .sales-product-select').each(function () {
                    const currentValue = $(this).val();
                    $(this).append(newOption);
                    if (currentValue) {
                        $(this).val(currentValue);
                    }
                });

                $('#quickAddProductModal').modal('hide');
                $('#quickAddProductForm')[0].reset();

                Swal.fire({
                    title: 'نجح',
                    text: response.data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: 'خطأ',
                    text: response.data.message,
                    icon: 'error'
                });
            }
        })
        .catch(function (error) {
            Swal.fire({
                title: 'خطأ',
                text: 'حدث خطأ أثناء الحفظ',
                icon: 'error'
            });
        });
}

function saveQuickCustomer() {
    const name = $('#newCustomerName').val().trim();
    const phone = $('#newCustomerPhone').val().trim();
    const address = $('#newCustomerAddress').val().trim();

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم العميل',
            icon: 'warning'
        });
        return;
    }

    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    axios.post('/DailyMovement/QuickAddCustomer', {
        Customer_Name: name,
        Customer_Phone: phone,
        Customer_Address: address
    })
        .then(function (response) {
            if (response.data.isValid) {
                const newCustomer = response.data.data;
                const newOption = `<option value="${newCustomer.customer_ID}">${newCustomer.customer_Name}</option>`;

                window.customersHTML += newOption;
                $('.customer-select').append(newOption);

                $('#quickAddCustomerModal').modal('hide');
                $('#quickAddCustomerForm')[0].reset();

                Swal.fire({
                    title: 'نجح',
                    text: response.data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: 'خطأ',
                    text: response.data.message,
                    icon: 'error'
                });
            }
        })
        .catch(function (error) {
            Swal.fire({
                title: 'خطأ',
                text: 'حدث خطأ أثناء الحفظ',
                icon: 'error'
            });
        });
}

function saveQuickSupplier() {
    const name = $('#newSupplierName').val().trim();
    const phone = $('#newSupplierPhone').val().trim();
    const address = $('#newSupplierAddress').val().trim();

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم المورد',
            icon: 'warning'
        });
        return;
    }

    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    axios.post('/DailyMovement/QuickAddSupplier', {
        Supplier_Name: name,
        Supplier_Phone: phone,
        Supplier_Address: address
    })
        .then(function (response) {
            if (response.data.isValid) {
                const newSupplier = response.data.data;
                const newOption = `<option value="${newSupplier.supplier_ID}">${newSupplier.supplier_Name}</option>`;

                window.suppliersHTML += newOption;
                $('.supplier-select').append(newOption);

                $('#quickAddSupplierModal').modal('hide');
                $('#quickAddSupplierForm')[0].reset();

                Swal.fire({
                    title: 'نجح',
                    text: response.data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: 'خطأ',
                    text: response.data.message,
                    icon: 'error'
                });
            }
        })
        .catch(function (error) {
            Swal.fire({
                title: 'خطأ',
                text: 'حدث خطأ أثناء الحفظ',
                icon: 'error'
            });
        });
}

function saveQuickExpenseItem() {
    const name = $('#newExpenseName').val().trim();

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم البند',
            icon: 'warning'
        });
        return;
    }

    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    axios.post('/DailyMovement/QuickAddExpenseItem', {
        ExpenseItem_Name: name
    })
        .then(function (response) {
            if (response.data.isValid) {
                const newCategory = response.data.data;
                const newOption = `<option value="${newCategory.expenseItem_ID}">${newCategory.expenseItem_Name}</option>`;

                window.categoriesHTML += newOption;
                $('.expense-category-select').append(newOption);

                $('#quickAddExpenseModal').modal('hide');
                $('#quickAddExpenseForm')[0].reset();

                Swal.fire({
                    title: 'نجح',
                    text: response.data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: 'خطأ',
                    text: response.data.message,
                    icon: 'error'
                });
            }
        })
        .catch(function (error) {
            Swal.fire({
                title: 'خطأ',
                text: 'حدث خطأ أثناء الحفظ',
                icon: 'error'
            });
        });
}

// ============================================
// Withdrawal & Balance Functions
// ============================================

function attachWithdrawalRowEvents() {
    $('.withdrawal-amount-input').off('input').on('input', function () {
        calculateWithdrawalTotals();
        calculateBalanceTotals();
    });
}

function calculateWithdrawalTotals() {
    let totalWarid = 0;
    let totalTaslim = 0;

    $('#withdrawalsTable tbody tr.withdrawal-row').each(function () {
        const type = $(this).data('type');
        const amount = parseFloat($(this).find('.withdrawal-amount-input').val()) || 0;

        if (type === 'وارد من الإدارة') {
            totalWarid += amount;
        } else if (type === 'تسليم للإدارة') {
            totalTaslim += amount;
        }
    });

    $('#totalWaridFromManagement').text(totalWarid.toFixed(2));
    $('#totalTaslimToManagement').text(totalTaslim.toFixed(2));
}

function attachBalanceRowEvents() {
    $('.balance-amount-input').not('[readonly]').off('input').on('input', function () {
        calculateBalanceTotals();
    });
}

function calculateBalanceTotals() {
    const rasidSabiqRow = $('#balancesTable tbody tr.balance-row[data-type="رصيد سابق"]');
    const rasidSabiq = parseFloat(rasidSabiqRow.find('.balance-amount-input').val()) || 0;

    let cashSales = 0;
    $('#salesTable tbody tr').each(function () {
        const paymentType = $(this).find('.sales-payment-type').val();
        const total = parseFloat($(this).find('.sales-total-input').val()) || 0;
        if (paymentType === 'نقدا') {
            cashSales += total;
        }
    });

    const salesRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد من المبيعات +"]');
    salesRow.find('.balance-amount-input').val(cashSales.toFixed(2));

    let customerPayments = 0;
    $('#customersTable tbody tr').each(function () {
        const amount = parseFloat($(this).find('.customer-amount-input').val()) || 0;
        customerPayments += amount;
    });
    const customerPaymentsRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد سداد عميل +"]');
    customerPaymentsRow.find('.balance-amount-input').val(customerPayments.toFixed(2));

    const waridRow = $('#withdrawalsTable tbody tr.withdrawal-row[data-type="وارد من الإدارة"]');
    const waridAmount = parseFloat(waridRow.find('.withdrawal-amount-input').val()) || 0;
    const mablaghWaridRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد من الإدارة +"]');
    mablaghWaridRow.find('.balance-amount-input').val(waridAmount.toFixed(2));

    let cashPurchases = 0;
    $('#movementTable tbody tr').each(function () {
        const paymentType = $(this).find('.payment-type').val();
        const total = parseFloat($(this).find('.total-input').val()) || 0;
        if (paymentType === 'نقدا') {
            cashPurchases += total;
        }
    });
    const purchasesRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ صادر مشتريات -"]');
    purchasesRow.find('.balance-amount-input').val(cashPurchases.toFixed(2));

    let supplierPayments = 0;
    $('#suppliersTable tbody tr').each(function () {
        const amount = parseFloat($(this).find('.supplier-amount-input').val()) || 0;
        supplierPayments += amount;
    });
    const supplierPaymentsRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ صادر سداد وارد -"]');
    supplierPaymentsRow.find('.balance-amount-input').val(supplierPayments.toFixed(2));

    const taslimRow = $('#withdrawalsTable tbody tr.withdrawal-row[data-type="تسليم للإدارة"]');
    const taslimAmount = parseFloat(taslimRow.find('.withdrawal-amount-input').val()) || 0;
    const mablaghMashubRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ مسحوب تسليم للإدارة -"]');
    mablaghMashubRow.find('.balance-amount-input').val(taslimAmount.toFixed(2));

    const totalExpenses = parseFloat($('#grandTotalExpenses').text()) || 0;
    const totalExpensesRow = $('#balancesTable tbody tr.balance-row[data-type="إجمالي المصروفات -"]');
    totalExpensesRow.find('.balance-amount-input').val(totalExpenses.toFixed(2));

    const totalPlus = cashSales + customerPayments + waridAmount;
    const totalMinus = cashPurchases + supplierPayments + taslimAmount + totalExpenses;

    const availableBalance = rasidSabiq + totalPlus - totalMinus;
    $('#availableBalance').text(availableBalance.toFixed(2));

    let cell = $('#availableBalance');
    cell.removeClass('balance-positive balance-negative');

    if (availableBalance > 0) {
        cell.addClass('balance-positive');
    } else if (availableBalance < 0) {
        cell.addClass('balance-negative');
    }

    return availableBalance;
}

function calculateGrandSummary() {
    const purchasesTotal = parseFloat($('#grandTotal').text()) || 0;
    const expensesTotal = parseFloat($('#grandTotalExpenses').text()) || 0;
    const suppliersTotal = parseFloat($('#grandTotalSuppliers').text()) || 0;
    const customersTotal = parseFloat($('#grandTotalCustomers').text()) || 0;
    const grandTotalAll = purchasesTotal + expensesTotal + suppliersTotal + customersTotal;

    $('#summaryPurchases').text(purchasesTotal.toFixed(2));
    $('#summaryExpenses').text(expensesTotal.toFixed(2));
    $('#summarySuppliers').text(suppliersTotal.toFixed(2));
    $('#summaryCustomers').text(customersTotal.toFixed(2));
    $('#grandTotalAll').text(grandTotalAll.toFixed(2));
}