

// حفظ قالب المنتجات
let productsSelectHtml = '';

$(document).ready(function () {
    // حفظ قالب المنتجات بشكل صحيح
    const templateSelect = $('#productsTemplate select');
    if (templateSelect.length > 0) {
        productsSelectHtml = templateSelect.html();
        console.log('Products loaded:', productsSelectHtml); // للتأكد من تحميل المنتجات
    } else {
        console.error('Products template not found!');
    }

    // حساب الإجماليات عند التحميل
    calculateMortalityTotals();
    calculateLivestockTotals();
    calculateOutgoingTotals();

    // Event listeners للحسابات التلقائية
    setupTableEventListeners();
});

// ============================
// النفوق والمستهلك
// ============================
function addMortalityRow() {
    const tbody = $('#mortalityTableBody');
    const rowCount = tbody.find('tr').length + 1;

    const newRow = `
        <tr class="data-row">
            <td class="text-center row-number">${rowCount}</td>
            <td>
                <select class="form-select form-select-sm product-select">
                    ${productsSelectHtml}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center quantity-input" value="0" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm notes-input" value="" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon btn-danger" onclick="deleteRow(this)">
                    <i class="fa-solid fa-trash fs-4"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);
    updateRowNumbers('mortalityTable');
    calculateMortalityTotals();
}

function calculateMortalityTotals() {
    let totalQuantity = 0;

    $('#mortalityTableBody tr').each(function () {
        const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
        totalQuantity += quantity;
    });

    $('#mortalityTotalQuantity').text(totalQuantity);
}

// ============================
// الحلال الموجود
// ============================
function addLivestockRow() {
    const tbody = $('#livestockTableBody');
    const rowCount = tbody.find('tr').length + 1;

    const newRow = `
        <tr class="data-row">
            <td class="text-center row-number">${rowCount}</td>
            <td>
                <select class="form-select form-select-sm product-select">
                    ${productsSelectHtml}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center quantity-input" value="0" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm notes-input" value="" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon btn-danger" onclick="deleteRow(this)">
                    <i class="fa-solid fa-trash fs-4"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);
    updateRowNumbers('livestockTable');
    calculateLivestockTotals();
}

function calculateLivestockTotals() {
    let totalQuantity = 0;

    $('#livestockTableBody tr').each(function () {
        const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
        totalQuantity += quantity;
    });

    $('#livestockTotalQuantity').text(totalQuantity);
}

// ============================
// الخارج من المزرعة
// ============================
function addOutgoingRow() {
    const tbody = $('#outgoingTableBody');
    const rowCount = tbody.find('tr').length + 1;

    const newRow = `
        <tr class="data-row">
            <td class="text-center row-number">${rowCount}</td>
            <td><input type="text" class="form-control form-control-sm delegate-input" value="" /></td>
            <td>
                <select class="form-select form-select-sm product-select">
                    ${productsSelectHtml}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center quantity-input" value="0" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm notes-input" value="" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon btn-danger" onclick="deleteRow(this)">
                    <i class="fa-solid fa-trash fs-4"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);
    updateRowNumbers('outgoingTable');
    calculateOutgoingTotals();
}

function calculateOutgoingTotals() {
    let totalQuantity = 0;

    $('#outgoingTableBody tr').each(function () {
        const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
        totalQuantity += quantity;
    });

    $('#outgoingTotalQuantity').text(totalQuantity);
}

// ============================
// دوال مشتركة
// ============================
function deleteRow(button) {
    const row = $(button).closest('tr');
    const tableId = row.closest('table').attr('id');

    row.remove();
    updateRowNumbers(tableId);

    // تحديث الإجماليات حسب الجدول
    if (tableId === 'mortalityTable') {
        calculateMortalityTotals();
    } else if (tableId === 'livestockTable') {
        calculateLivestockTotals();
    } else if (tableId === 'outgoingTable') {
        calculateOutgoingTotals();
    }
}

//function updateRowNumbers(tableId) {
//    $(`#${tableId} tbody tr`).each(function (index) {
//        $(this).find('.row-number').text(index + 1);
//    });
//}

function setupTableEventListeners() {
    // النفوق والمستهلك
    $(document).on('input', '#mortalityTableBody .quantity-input', function () {
        calculateMortalityTotals();
    });

    // الحلال الموجود
    $(document).on('input', '#livestockTableBody .quantity-input', function () {
        calculateLivestockTotals();
    });

    // الخارج من المزرعة
    $(document).on('input', '#outgoingTableBody .quantity-input', function () {
        calculateOutgoingTotals();
    });
}

function saveAllMovement() {
    // جمع البيانات مع التحقق من null
    const mortalities = [];
    $('#mortalityTableBody tr.data-row').each(function () {
        const productId = parseInt($(this).find('.product-select').val()) || 0;
        const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
        const notes = $(this).find('.notes-input').val() || "";

        if (productId > 0 && quantity > 0) {
            mortalities.push({
                WarehouseMortality_ProductID: productId,
                WarehouseMortality_Quantity: quantity,
                WarehouseMortality_Notes: notes
            });
        }
    });

    // نفس الكود لـ livestocks و outgoings...

    // ✅ التأكد من أن المصفوفات مش null
    const data = {
        Mortalities: mortalities.length > 0 ? mortalities : [],
        Livestocks: livestocks.length > 0 ? livestocks : [],
        Outgoings: outgoings.length > 0 ? outgoings : []
    };

    // ✅ التحقق من وجود بيانات
    if (data.Mortalities.length === 0 && data.Livestocks.length === 0 && data.Outgoings.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'يرجى إضافة بيانات قبل الحفظ',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    // إرسال البيانات
    $.ajax({
        url: '/WarehouseMovement/Save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'نجح الحفظ',
                    text: response.message,
                    confirmButtonText: 'حسناً'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: response.message,
                    confirmButtonText: 'حسناً'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء الحفظ: ' + error,
                confirmButtonText: 'حسناً'
            });
        }
    });
}


// WarehouseMovement.js

// تحديث الأرقام التسلسلية
function updateRowNumbers() {
    // تحديث النفوق والمستهلك
    $('#mortalityTableBody tr.data-row').each(function (index) {
        $(this).find('.row-number').text(index + 1);
    });

    // تحديث الحلال الموجود
    $('#livestockTableBody tr.data-row').each(function (index) {
        $(this).find('.row-number').text(index + 1);
    });

    // تحديث الخارج من المزرعة
    $('#outgoingTableBody tr.data-row').each(function (index) {
        $(this).find('.row-number').text(index + 1);
    });

    calculateTotals();
}

// حساب الإجماليات
function calculateTotals() {
    // إجمالي النفوق والمستهلك
    let mortalityTotal = 0;
    $('#mortalityTableBody tr.data-row').each(function () {
        const quantity = parseFloat($(this).find('.quantity-input').val()) || 0;
        mortalityTotal += quantity;
    });
    $('#mortalityTotalQuantity').text(mortalityTotal);

    // إجمالي الحلال الموجود
    let livestockTotal = 0;
    $('#livestockTableBody tr.data-row').each(function () {
        const quantity = parseFloat($(this).find('.quantity-input').val()) || 0;
        livestockTotal += quantity;
    });
    $('#livestockTotalQuantity').text(livestockTotal);

    // إجمالي الخارج من المزرعة
    let outgoingTotal = 0;
    $('#outgoingTableBody tr.data-row').each(function () {
        const quantity = parseFloat($(this).find('.quantity-input').val()) || 0;
        outgoingTotal += quantity;
    });
    $('#outgoingTotalQuantity').text(outgoingTotal);
}

// إضافة صف جديد - النفوق والمستهلك
function addMortalityRow() {
    const rowCount = $('#mortalityTableBody tr.data-row').length + 1;
    const productsSelect = $('#productsTemplate select').html();

    const newRow = `
        <tr class="data-row">
            <td class="text-center row-number">${rowCount}</td>
            <td>
                <select class="form-select form-select-sm product-select">
                    ${productsSelect}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center quantity-input" value="0" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm notes-input" value="" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon btn-danger" onclick="deleteRow(this)">
                    <i class="fa-solid fa-trash fs-4"></i>
                </button>
            </td>
        </tr>
    `;

    $('#mortalityTableBody').append(newRow);
    attachEventHandlers();
    updateRowNumbers();
}

// إضافة صف جديد - الحلال الموجود
function addLivestockRow() {
    const rowCount = $('#livestockTableBody tr.data-row').length + 1;
    const productsSelect = $('#productsTemplate select').html();

    const newRow = `
        <tr class="data-row">
            <td class="text-center row-number">${rowCount}</td>
            <td>
                <select class="form-select form-select-sm product-select">
                    ${productsSelect}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center quantity-input" value="0" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm notes-input" value="" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon btn-danger" onclick="deleteRow(this)">
                    <i class="fa-solid fa-trash fs-4"></i>
                </button>
            </td>
        </tr>
    `;

    $('#livestockTableBody').append(newRow);
    attachEventHandlers();
    updateRowNumbers();
}

// إضافة صف جديد - الخارج من المزرعة
function addOutgoingRow() {
    const rowCount = $('#outgoingTableBody tr.data-row').length + 1;
    const productsSelect = $('#productsTemplate select').html();
    const delegatesSelect = $('#delegatesTemplate select').html();

    const newRow = `
        <tr class="data-row">
            <td class="text-center row-number">${rowCount}</td>
            <td>
                <select class="form-select form-select-sm delegate-select">
                    ${delegatesSelect}
                </select>
            </td>
            <td>
                <select class="form-select form-select-sm product-select">
                    ${productsSelect}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center quantity-input" value="0" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm notes-input" value="" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon btn-danger" onclick="deleteRow(this)">
                    <i class="fa-solid fa-trash fs-4"></i>
                </button>
            </td>
        </tr>
    `;

    $('#outgoingTableBody').append(newRow);
    attachEventHandlers();
    updateRowNumbers();
}

// حذف صف
function deleteRow(btn) {
    $(btn).closest('tr').remove();
    updateRowNumbers();
}

// ربط الأحداث بالعناصر الجديدة
function attachEventHandlers() {
    $('.quantity-input').off('input').on('input', function () {
        calculateTotals();
    });
}

// حفظ البيان الكامل
function saveAllMovement() {
    // جمع بيانات النفوق والمستهلك
    const mortalities = [];
    $('#mortalityTableBody tr.data-row').each(function () {
        const productId = parseInt($(this).find('.product-select').val());
        const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
        const notes = $(this).find('.notes-input').val();

        if (productId && quantity > 0) {
            mortalities.push({
                WarehouseMortality_ProductID: productId,
                WarehouseMortality_Quantity: quantity,
                WarehouseMortality_Notes: notes
            });
        }
    });

    // جمع بيانات الحلال الموجود
    const livestocks = [];
    $('#livestockTableBody tr.data-row').each(function () {
        const productId = parseInt($(this).find('.product-select').val());
        const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
        const notes = $(this).find('.notes-input').val();

        if (productId && quantity > 0) {
            livestocks.push({
                WarehouseLivestock_ProductID: productId,
                WarehouseLivestock_Quantity: quantity,
                WarehouseLivestock_Notes: notes
            });
        }
    });

    // جمع بيانات الخارج من المزرعة
    const outgoings = [];
    $('#outgoingTableBody tr.data-row').each(function () {
        const delegateName = $(this).find('.delegate-select').val();
        const productId = parseInt($(this).find('.product-select').val());
        const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
        const notes = $(this).find('.notes-input').val();

        if (delegateName && productId && quantity > 0) {
            outgoings.push({
                WarehouseOutgoing_DelegateName: delegateName,
                WarehouseOutgoing_ProductID: productId,
                WarehouseOutgoing_Quantity: quantity,
                WarehouseOutgoing_Notes: notes
            });
        }
    });

    // التحقق من وجود بيانات
    if (mortalities.length === 0 && livestocks.length === 0 && outgoings.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'يجب إضافة بيانات على الأقل في جدول واحد',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    const data = {
        Mortalities: mortalities,
        Livestocks: livestocks,
        Outgoings: outgoings
    };

    // إرسال البيانات للـ Controller
    $.ajax({
        url: '/WarehouseMovement/Save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'نجح الحفظ',
                    text: response.message,
                    confirmButtonText: 'حسناً'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: response.message,
                    confirmButtonText: 'حسناً'
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء الحفظ',
                confirmButtonText: 'حسناً'
            });
        }
    });
}

// تهيئة الصفحة عند التحميل
$(document).ready(function () {
    attachEventHandlers();
    calculateTotals();
});


