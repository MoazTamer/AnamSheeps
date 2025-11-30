// Products Data (from ViewBag)
let productsHTML = window.productsHTML || '';

function enhanceMobileExperience() {

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {

        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('touchstart', function (e) {

                e.stopPropagation();
            });

            select.addEventListener('focus', function () {
                setTimeout(() => {
                    this.style.backgroundColor = '#ffffff';
                    this.style.zIndex = '1000';
                }, 100);
            });

            select.addEventListener('blur', function () {
                this.style.zIndex = 'auto';
            });
        });

        document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
            input.addEventListener('focus', function () {
                this.style.backgroundColor = '#ffffff';
                this.style.zIndex = '1000';
            });

            input.addEventListener('blur', function () {
                this.style.zIndex = 'auto';
            });
        });
    }
}

function attachBalanceAutoCalculation() {
    // كل الـ inputs اللي بتأثر على الرصيد
    $('.quantity-input, .price-input, .total-input, .payment-type, ' +
        '.sales-quantity-input, .sales-price-input, .sales-total-input, .sales-payment-type, ' +
        '.expense-quantity-input, .expense-amount-input, .expense-total-input, .expense-category-input, ' + 
        '.supplier-amount-input, .supplier-name-input, ' + 
        '.customer-amount-input, .customer-name-input, ' + 
        '.taslim-amount-input, .taslim-receiver-input, ' +
        '.warid-amount-input, .warid-receiver-input, ' +
        '.withdrawal-amount-input, .balance-amount-input').off('input change').on('input change', function () {
                   setTimeout(calculateBalanceTotals, 100);
        });
}

$(document).ready(function () {
    // Check if productsHTML was set from the page
    if (!productsHTML) {
        // Get products HTML from hidden template
        const template = $('#productsTemplate select');
        if (template.length > 0) {
            productsHTML = template.html();
            console.log('Products loaded from template');
        } else {
            // Fallback: try to get from existing select
            const firstSelect = $('.product-select').first();
            if (firstSelect.length > 0) {
                productsHTML = firstSelect.html();
                console.log('Products loaded from existing select');
            } else {
                console.error('No products source found!');
            }
        }
        attachBalanceAutoCalculation();
        $("#availableBalance").text(balance.toFixed(2));
        updateBalanceUI();

    } else {
        console.log('Products loaded from window.productsHTML');
    }

    // Calculate totals on page load
    calculateTotals();
    calculateBalanceTotals();

    // Attach event handlers to existing rows
    attachRowEvents();

    // Debug: Check if products are loaded
    console.log('Products HTML length:', productsHTML.length);
    const optionsCount = (productsHTML.match(/<option/g) || []).length;
    console.log('Product options count:', optionsCount);
});

// Add new empty row
function addNewRow() {
    const tbody = $('#movementTableBody');
    const rowCount = tbody.find('tr').length + 1;

    if (!productsHTML || productsHTML.trim() === '') {
        Swal.fire({
            title: 'خطأ',
            text: 'لا توجد أصناف متاحة. من فضلك أضف أصناف أولاً.',
            icon: 'error',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    const newRow = `
        <tr class="data-row">
            <td class="text-center row-number fw-bold">${rowCount}</td>
            <td>
                <select class="form-select form-select-sm product-select select-arrow-left">
                    ${productsHTML}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center quantity-input" min="0" /></td>
            <td><input type="number" step="1" class="form-control form-control-sm text-center price-input" min="0" /></td>
            <td><input type="number" step="1" class="form-control form-control-sm text-center total-input" min="0" /></td>
            <td>
                <select class="form-select form-select-sm payment-type">
                    <option value="نقدا">نقدا</option>
                    <option value="آجل">آجل</option>
                    <option value="تحويل">تحويل</option>
                </select>
            </td>
            <td><input type="text" class="form-control form-control-sm notes-input" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon" onclick="deleteRow(this)">
                    <i class="ki-duotone ki-trash fs-2"></i>
                    <i class="fa-solid fa-trash fs-4 text-danger"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);

    const lastSelect = tbody.find('.product-select').last()[0];
    new Choices(lastSelect, {
        searchEnabled: true,
        itemSelectText: '',
        placeholderValue: 'اختر الصنف...',
        searchPlaceholderValue: 'اكتب للبحث...',
        shouldSort: false,
        position: 'bottom',
        searchResultLimit: 10,
        noResultsText: 'لا توجد نتائج',
        noChoicesText: 'لا توجد عناصر',
        dir: 'rtl',

    });

    attachRowEvents();
    updateRowNumbers();
}

// Attach event handlers to rows
function attachRowEvents() {
    // When product changes, update price
    $('.product-select').off('change').on('change', function () {
        const selectedOption = $(this).find('option:selected');
        const price = parseFloat(selectedOption.data('price')) || 0;
        const row = $(this).closest('tr');
        row.find('.price-input').val(price.toFixed(2));
        calculateRowTotal(row);
    });

    // When quantity changes, calculate total
    $('.quantity-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat($(this).val()) || 0;
        const price = parseFloat(row.find('.price-input').val()) || 0;
        const total = quantity * price;
        row.find('.total-input').val(total.toFixed(2));
        calculateTotals();
    });

    // When price changes, calculate total
    $('.price-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.quantity-input').val()) || 0;
        const price = parseFloat($(this).val()) || 0;
        const total = quantity * price;
        row.find('.total-input').val(total.toFixed(2));
        calculateTotals();
    });

    // When total changes, calculate price
    $('.total-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.quantity-input').val()) || 0;
        const total = parseFloat($(this).val()) || 0;
        if (quantity > 0) {
            const price = total / quantity;
            row.find('.price-input').val(price.toFixed(2));
        }
        calculateTotals();


    });

    // When payment type changes, recalculate totals
    $('.payment-type').off('change').on('change', function () {
        calculateTotals();
    });
}

// Calculate row total
function calculateRowTotal(row) {
    const quantity = parseFloat(row.find('.quantity-input').val()) || '';
    const price = parseFloat(row.find('.price-input').val()) || '';
    const total = quantity * price;
    row.find('.total-input').val(total.toFixed(2));
    calculateTotals();
}

// Calculate all totals
function calculateTotals() {
    let totalQuantity = 0;
    let grandTotal = 0;
    let totalCredit = 0;
    let totalCash = 0;
    let cashQuantity = 0;
    let creditQuantity = 0;

    $('#movementTableBody tr.data-row').each(function () {
        const quantity = parseFloat($(this).find('.quantity-input').val()) || 0;
        const total = parseFloat($(this).find('.total-input').val()) || 0;
        const paymentType = $(this).find('.payment-type').val();

        totalQuantity += quantity;
        grandTotal += total;

        if (paymentType === 'آجل') {
            totalCredit += total;
            creditQuantity += quantity;
            //} else {
        } if (paymentType === 'نقدا') {
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

// Delete row
function deleteRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف هذا البند",
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(button).closest('tr').remove();
            updateRowNumbers();
            calculateTotals();
        }
    });
}

// Update row numbers
function updateRowNumbers() {
    $('#movementTableBody tr.data-row').each(function (index) {
        $(this).find('.row-number').text(index + 1);
    });
}

// Save movement
function saveMovement() {
    const details = [];
    let isValid = true;

    $('#movementTableBody tr.data-row').each(function () {
        const productId = $(this).find('.product-select').val();
        const quantity = parseFloat($(this).find('.quantity-input').val()) || 0;
        const price = parseFloat($(this).find('.price-input').val()) || 0;
        const total = parseFloat($(this).find('.total-input').val()) || 0;
        const paymentType = $(this).find('.payment-type').val();
        const notes = $(this).find('.notes-input').val();

        if (!productId) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك اختر الصنف في جميع الصفوف',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        if (quantity <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل العدد بشكل صحيح',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
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

    if (!isValid || details.length === 0) {
        if (details.length === 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أضف صنف واحد على الأقل',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
        }
        return;
    }

    const data = {
        Details: details
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

// =====================================
// SALES FUNCTIONS


function addNewSalesRow() {
    const tbody = $('#salesTableBody');
    const rowCount = tbody.find('tr').length + 1;

    if (!productsHTML || productsHTML.trim() === '') {
        Swal.fire({
            title: 'خطأ',
            text: 'لا توجد أصناف متاحة',
            icon: 'error',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    const newRow = `
        <tr class="sales-row">
            <td class="text-center sales-row-number fw-bold">${rowCount}</td>
            <td>
                <select class="form-select form-select-sm sales-product-select select-arrow-left">
                    ${productsHTML}
                </select>
            </td>
            <td><input type="number" class="form-control form-control-sm text-center sales-quantity-input" min="0" /></td>
            <td><input type="number" step="0.01" class="form-control form-control-sm text-center sales-price-input" min="0" /></td>
            <td><input type="number" step="0.01" class="form-control form-control-sm text-center sales-total-input" min="0" /></td>
            <td>
                <select class="form-select form-select-sm sales-payment-type">
                    <option value="نقدا">نقدا</option>
                    <option value="آجل">آجل</option>
                    <option value="تحويل">تحويل</option>
                    <option value="تمويل">تمويل</option>
                </select>
            </td>
            <td><input type="text" class="form-control form-control-sm sales-notes-input" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon" onclick="deleteSalesRow(this)">
                    <i class="fa-solid fa-trash fs-4 text-danger"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);

    // 🟢 شغّل Choices.js على الـ select الجديد
    const lastSelect = tbody.find('.sales-product-select').last()[0];
    new Choices(lastSelect, {
        searchEnabled: true,
        itemSelectText: '',
        placeholderValue: 'اختر الصنف...',
        searchPlaceholderValue: 'اكتب للبحث...',
        shouldSort: false,
        position: 'bottom',
        searchResultLimit: 10,
        noResultsText: 'لا توجد نتائج',
        noChoicesText: 'لا توجد عناصر',
        dir: 'rtl'
    });

    attachSalesRowEvents();
    updateSalesRowNumbers();
}

function attachSalesRowEvents() {
    $('.sales-product-select').off('change').on('change', function () {
        const selectedOption = $(this).find('option:selected');
        const price = parseFloat(selectedOption.data('price')) || 0;
        const row = $(this).closest('tr');
        row.find('.sales-price-input').val(price.toFixed(2));
        calculateSalesRowTotal(row);
    });

    $('.sales-quantity-input, .sales-price-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        calculateSalesRowTotal(row);
    });

    $('.sales-total-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.sales-quantity-input').val()) || 0;
        const total = parseFloat($(this).val()) || 0;
        if (quantity > 0) {
            const price = total / quantity;
            row.find('.sales-price-input').val(price.toFixed(2));
        }
        calculateSalesTotals();
        calculateBalanceTotals();
    });

    $('.sales-payment-type').off('change').on('change', function () {
        calculateSalesTotals();
        calculateBalanceTotals();
    });
}

function calculateSalesRowTotal(row) {
    const quantity = parseFloat(row.find('.sales-quantity-input').val()) || 0;
    const price = parseFloat(row.find('.sales-price-input').val()) || 0;
    const total = quantity * price;
    row.find('.sales-total-input').val(total.toFixed(2));
    calculateSalesTotals();
    calculateBalanceTotals();
}

function calculateSalesTotals() {
    let totalQuantity = 0;
    let grandTotal = 0;
    let totalCredit = 0;
    let totalCash = 0;
    let cashQuantity = 0;
    let creditQuantity = 0;

    $('#salesTableBody tr.sales-row').each(function () {
        const quantity = parseFloat($(this).find('.sales-quantity-input').val()) || 0;
        const total = parseFloat($(this).find('.sales-total-input').val()) || 0;
        const paymentType = $(this).find('.sales-payment-type').val();

        totalQuantity += quantity;
        grandTotal += total;

        if (paymentType === 'آجل') {
            totalCredit += total;
            creditQuantity += quantity;
            //} else {
        } if (paymentType === 'نقدا') {
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

function deleteSalesRow(button) {
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
            $(button).closest('tr').remove();
            updateSalesRowNumbers();
            calculateSalesTotals();
            calculateBalanceTotals();
        }
    });
}

function updateSalesRowNumbers() {
    $('#salesTableBody tr.sales-row').each(function (index) {
        $(this).find('.sales-row-number').text(index + 1);
    });
}

// =====================================


// Expense Categories Data
let categoriesHTML = '';
let suppliersHTML = '';
let customersHTML = '';

$(document).ready(function () {
    // Load categories HTML
    const categoriesTemplate = $('#categoriesTemplate select');
    if (categoriesTemplate.length > 0) {
        categoriesHTML = categoriesTemplate.html();
        console.log('Categories loaded from template');
    }

    // Load suppliers HTML
    const suppliersTemplate = $('#suppliersTemplate select');
    if (suppliersTemplate.length > 0) {
        suppliersHTML = suppliersTemplate.html();
        console.log('Suppliers loaded from template');
    }

    // Load customers HTML
    const customersTemplate = $('#customersTemplate select');
    if (customersTemplate.length > 0) {
        customersHTML = customersTemplate.html();
        console.log('Customers loaded from template');
    }

    // Calculate expenses totals on page load
    calculateExpenseTotals();
    calculateSupplierTotals();
    calculateCustomerTotals();
    calculateWithdrawalTotals();
    calculateBalanceTotals();
    calculateGrandSummary();


    // Attach event handlers to existing expense rows
    attachExpenseRowEvents();
    attachSupplierRowEvents();
    attachCustomerRowEvents();
    attachWithdrawalRowEvents();
    attachBalanceRowEvents();

    attachBalanceAutoCalculation();
});

// Add new expense row
function addNewExpenseRow() {
    const tbody = $('#expensesTableBody');
    const rowCount = tbody.find('tr').length + 1;

    if (!categoriesHTML || categoriesHTML.trim() === '') {
        Swal.fire({
            title: 'خطأ',
            text: 'لا توجد بنود متاحة. من فضلك أضف بنود المصروفات أولاً.',
            icon: 'error',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    const newRow = `
        <tr class="expense-row">
            <td class="text-center expense-row-number fw-bold">${rowCount}</td>
            <td>
               <input type="text" class="form-control form-control-sm expense-category-input" placeholder="اسم المصروف" />
            </td>
            <td><input type="number" class="form-control form-control-sm text-center expense-quantity-input" value="" min="0" /></td>
            <td><input type="number" step="0.01" class="form-control form-control-sm text-center expense-amount-input" value="" min="0" /></td>
            <td><input type="number" step="0.01" class="form-control form-control-sm text-center expense-total-input" value="" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm expense-notes-input" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon" onclick="deleteExpenseRow(this)">
                    <i class="fa-solid fa-trash fs-4 text-danger"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);

  
    attachExpenseRowEvents();
    updateExpenseRowNumbers();
}

// Attach event handlers to expense rows
function attachExpenseRowEvents() {

    $('.expense-category-input').off('input').on('input', function () {
    });

    // When quantity changes, calculate total
    $('.expense-quantity-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat($(this).val()) || 0;
        const amount = parseFloat(row.find('.expense-amount-input').val()) || 0;
        const total = quantity * amount;
        row.find('.expense-total-input').val(total.toFixed(2));
        calculateExpenseTotals();
        calculateBalanceTotals();
        calculateGrandSummary();
    });

    // When amount changes, calculate total
    $('.expense-amount-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.expense-quantity-input').val()) || 0;
        const amount = parseFloat($(this).val()) || 0;
        const total = quantity * amount;
        row.find('.expense-total-input').val(total.toFixed(2));
        calculateExpenseTotals();
        calculateBalanceTotals();
        calculateGrandSummary();
    });

    // When total changes, calculate amount
    $('.expense-total-input').off('input').on('input', function () {
        const row = $(this).closest('tr');
        const quantity = parseFloat(row.find('.expense-quantity-input').val()) || 0;
        const total = parseFloat($(this).val()) || 0;
        if (quantity > 0) {
            const amount = total / quantity;
            row.find('.expense-amount-input').val(amount.toFixed(2));
        }
        calculateExpenseTotals();
        calculateBalanceTotals();
        calculateGrandSummary();
    });
}

// Calculate expense totals
function calculateExpenseTotals() {
    let totalQuantity = 0;
    let grandTotal = 0;

    $('#expensesTableBody tr.expense-row').each(function () {
        const quantity = parseFloat($(this).find('.expense-quantity-input').val()) || 0;
        const total = parseFloat($(this).find('.expense-total-input').val()) || 0;

        totalQuantity += quantity;
        grandTotal += total;
    });

    $('#totalExpenseQuantity').text(totalQuantity);
    $('#grandTotalExpenses').text(grandTotal.toFixed(2));

    calculateBalanceTotals();

    return grandTotal;
}

// Calculate grand summary (purchases + expenses + suppliers + customers)
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

// Delete expense row
function deleteExpenseRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف هذا المصروف",
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(button).closest('tr').remove();
            updateExpenseRowNumbers();
            calculateExpenseTotals();
            calculateGrandSummary();
        }
    });
}

// Update expense row numbers
function updateExpenseRowNumbers() {
    $('#expensesTableBody tr.expense-row').each(function (index) {
        $(this).find('.expense-row-number').text(index + 1);
    });
}

// Update calculateTotals to also update grand summary
const originalCalculateTotals = calculateTotals;
calculateTotals = function () {
    originalCalculateTotals();
    calculateGrandSummary();
};

// Update saveMovement to include expenses

// =====================================
// Suppliers Functions
// =====================================

// Add new supplier row
function addNewSupplierRow() {
    const tbody = $('#suppliersTableBody');
    const rowCount = tbody.find('tr').length + 1;

    if (!suppliersHTML || suppliersHTML.trim() === '') {
        Swal.fire({
            title: 'خطأ',
            text: 'لا توجد موردين متاحين. من فضلك أضف موردين أولاً.',
            icon: 'error',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    const newRow = `
        <tr class="supplier-row">
            <td class="text-center supplier-row-number fw-bold">${rowCount}</td>
            <td><input type="text" class="form-control form-control-sm supplier-name-input" placeholder="اسم المورد" /></td>

              
            <td><input type="number" step="0.01" class="form-control form-control-sm text-center supplier-amount-input" value="" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm supplier-notes-input" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon" onclick="deleteSupplierRow(this)">
                    <i class="fa-solid fa-trash fs-4 text-danger"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);

    attachSupplierRowEvents();
    updateSupplierRowNumbers();
}

// Attach event handlers to supplier rows
function attachSupplierRowEvents() {

    $('.supplier-name-input').off('input').on('input', function () {
    });
    // When amount changes, calculate totals
    $('.supplier-amount-input').off('input').on('input', function () {
        calculateSupplierTotals();
        calculateBalanceTotals();
        calculateGrandSummary();
    });
}

// Calculate supplier totals
function calculateSupplierTotals() {
    let grandTotal = 0;

    $('#suppliersTableBody tr.supplier-row').each(function () {
        const amount = parseFloat($(this).find('.supplier-amount-input').val()) || 0;
        grandTotal += amount;
    });

    $('#grandTotalSuppliers').text(grandTotal.toFixed(2));

    calculateBalanceTotals();

    return grandTotal;
}

// Delete supplier row
function deleteSupplierRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف هذا المورد",
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(button).closest('tr').remove();
            updateSupplierRowNumbers();
            calculateSupplierTotals();
            calculateGrandSummary();
        }
    });
}

// Update supplier row numbers
function updateSupplierRowNumbers() {
    $('#suppliersTableBody tr.supplier-row').each(function (index) {
        $(this).find('.supplier-row-number').text(index + 1);
    });
}

// =====================================
// Customers Functions
// =====================================

// Add new customer row
function addNewCustomerRow() {
    const tbody = $('#customersTableBody');
    const rowCount = tbody.find('tr').length + 1;

    if (!customersHTML || customersHTML.trim() === '') {
        Swal.fire({
            title: 'خطأ',
            text: 'لا توجد عملاء متاحين. من فضلك أضف عملاء أولاً.',
            icon: 'error',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    const newRow = `
        <tr class="customer-row">
            <td class="text-center customer-row-number fw-bold">${rowCount}</td>
            <td><input type="text" class="form-control form-control-sm customer-name-input" /></td>

            <td><input type="number" step="0.01" class="form-control form-control-sm text-center customer-amount-input" value="" min="0" /></td>
            <td><input type="text" class="form-control form-control-sm customer-notes-input" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon" onclick="deleteCustomerRow(this)">
                    <i class="fa-solid fa-trash fs-4 text-danger"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);

    attachCustomerRowEvents();
    updateCustomerRowNumbers();
}

// Attach event handlers to customer rows
function attachCustomerRowEvents() {

    $('.customer-name-input').off('input').on('input', function () {
    });

    // When amount changes, calculate totals
    $('.customer-amount-input').off('input').on('input', function () {
        calculateCustomerTotals();
        calculateBalanceTotals(); 
        calculateGrandSummary();
    });
}

// Calculate customer totals
function calculateCustomerTotals() {
    let grandTotal = 0;

    $('#customersTableBody tr.customer-row').each(function () {
        const amount = parseFloat($(this).find('.customer-amount-input').val()) || 0;
        grandTotal += amount;
    });

    $('#grandTotalCustomers').text(grandTotal.toFixed(2));

    calculateBalanceTotals();

    return grandTotal;
}

// Delete customer row
function deleteCustomerRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف هذا العميل",
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(button).closest('tr').remove();
            updateCustomerRowNumbers();
            calculateCustomerTotals();
            calculateGrandSummary();
        }
    });
}

// Update customer row numbers
function updateCustomerRowNumbers() {
    $('#customersTableBody tr.customer-row').each(function (index) {
        $(this).find('.customer-row-number').text(index + 1);
    });
}

// =====================================
// Withdrawals Functions
// =====================================

// Attach event handlers to withdrawal rows
function attachWithdrawalRowEvents() {
    $('.withdrawal-amount-input').off('input').on('input', function () {
        calculateWithdrawalTotals();
        calculateGrandSummary();
    });
}

// Calculate withdrawal totals
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

    calculateBalanceTotals();
}

$(document).ready(function () {
    attachWithdrawalRowEvents();
});


// =====================================
// Balances Functions
// =====================================

// Attach event handlers to balance rows
function attachBalanceRowEvents() {
    $('.balance-amount-input').not('[readonly]').off('input').on('input', function () {
        calculateBalanceTotals();
        calculateGrandSummary();
    });
}

function attachWithdrawalRowEvents() {
    $('.withdrawal-amount-input').off('input').on('input', function () {
        calculateWithdrawalTotals();
        calculateGrandSummary();
    });
}

// Calculate withdrawal totals
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

// =====================================
// Balances Functions
// =====================================

// Attach event handlers to balance rows
function attachBalanceRowEvents() {
    $('.balance-amount-input').not('[readonly]').off('input').on('input', function () {
        calculateBalanceTotals();
        calculateGrandSummary();
    });
}


// Calculate balance totals with automatic values
// =====================================
// Taslim (تسليم للإدارة) Functions
// =====================================

// Add new taslim row
function addNewTaslimRow() {
    const tbody = $('#taslimTableBody');
    const rowCount = tbody.find('tr').length + 1;

    const newRow = `
        <tr class="taslim-row">
            <td class="text-center taslim-row-number fw-bold">${rowCount}</td>
            <td>
                <input type="text"
                       class="form-control form-control-sm taslim-receiver-input"
                       placeholder="اسم المستلم" />
            </td>
            <td>
                <input type="number" step="1"
                       class="form-control form-control-sm text-center taslim-amount-input"
                       min="0" />
            </td>
            <td>
                <input type="text"
                       class="form-control form-control-sm taslim-notes-input" />
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon" onclick="deleteTaslimRow(this)">
                    <i class="fa-solid fa-trash fs-4 text-danger"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);
    attachTaslimRowEvents();
    updateTaslimRowNumbers();
}

// Attach event handlers to taslim rows
function attachTaslimRowEvents() {
    $('.taslim-amount-input').off('input').on('input', function () {
        calculateTaslimTotals();
        calculateBalanceTotals();
        calculateGrandSummary();
    });
}

// Calculate taslim totals
function calculateTaslimTotals() {
    let grandTotal = 0;

    $('#taslimTableBody tr.taslim-row').each(function () {
        const amount = parseFloat($(this).find('.taslim-amount-input').val()) || 0;
        grandTotal += amount;
    });

    $('#grandTotalTaslim').text(grandTotal.toFixed(2));
    return grandTotal;
}

// Delete taslim row
function deleteTaslimRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف هذا التسليم",
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(button).closest('tr').remove();
            updateTaslimRowNumbers();
            calculateTaslimTotals();
            calculateBalanceTotals();
            calculateGrandSummary();
        }
    });
}

// Update taslim row numbers
function updateTaslimRowNumbers() {
    $('#taslimTableBody tr.taslim-row').each(function (index) {
        $(this).find('.taslim-row-number').text(index + 1);
    });
}

// =====================================
// Warid (وارد من الإدارة) Functions
// =====================================

// Add new warid row
function addNewWaridRow() {
    const tbody = $('#waridTableBody');
    const rowCount = tbody.find('tr').length + 1;

    const newRow = `
        <tr class="warid-row">
            <td class="text-center warid-row-number fw-bold">${rowCount}</td>
            <td>
                <input type="text"
                       class="form-control form-control-sm warid-receiver-input"
                       placeholder="اسم الشخص" />
            </td>
            <td>
                <input type="number" step="1"
                       class="form-control form-control-sm text-center warid-amount-input"
                       min="0" />
            </td>
            <td>
                <input type="text"
                       class="form-control form-control-sm warid-notes-input" />
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon" onclick="deleteWaridRow(this)">
                    <i class="fa-solid fa-trash fs-4 text-danger"></i>
                </button>
            </td>
        </tr>
    `;

    tbody.append(newRow);
    attachWaridRowEvents();
    updateWaridRowNumbers();
}

// Attach event handlers to warid rows
function attachWaridRowEvents() {
    $('.warid-amount-input').off('input').on('input', function () {
        calculateWaridTotals();
        calculateBalanceTotals();
        calculateGrandSummary();
    });
}

// Calculate warid totals
function calculateWaridTotals() {
    let grandTotal = 0;

    $('#waridTableBody tr.warid-row').each(function () {
        const amount = parseFloat($(this).find('.warid-amount-input').val()) || 0;
        grandTotal += amount;
    });

    $('#grandTotalWarid').text(grandTotal.toFixed(2));
    return grandTotal;
}

// Delete warid row
function deleteWaridRow(button) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف هذا الوارد",
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(button).closest('tr').remove();
            updateWaridRowNumbers();
            calculateWaridTotals();
            calculateBalanceTotals();
            calculateGrandSummary();
        }
    });
}

// Update warid row numbers
function updateWaridRowNumbers() {
    $('#waridTableBody tr.warid-row').each(function (index) {
        $(this).find('.warid-row-number').text(index + 1);
    });
}

// =====================================
// Updated Balance Calculation with Taslim & Warid
// =====================================

// Calculate balance totals with automatic values including Taslim & Warid
function calculateBalanceTotals() {
    // رصيد سابق (مدخل يدوي)
    const rasidSabiqRow = $('#balancesTable tbody tr.balance-row[data-type="رصيد سابق"]');
    const rasidSabiq = parseFloat(rasidSabiqRow.find('.balance-amount-input').val()) || 0;

    // مبلغ وارد من المبيعات + (من جدول المبيعات نقدا فقط)
    let cashSales = 0;
    $('#salesTableBody tr.sales-row').each(function () {
        const paymentType = $(this).find('.sales-payment-type').val();
        const total = parseFloat($(this).find('.sales-total-input').val()) || 0;
        if (paymentType === 'نقدا') {
            cashSales += total;
        }
    });

    const salesRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد من المبيعات +"]');
    salesRow.find('.balance-amount-input').val(cashSales.toFixed(2));

    // مبلغ وارد سداد عميل + 
    let customerPayments = 0;
    $('#customersTableBody tr.customer-row').each(function () {
        const amount = parseFloat($(this).find('.customer-amount-input').val()) || 0;
        customerPayments += amount;
    });
    const customerPaymentsRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد سداد عميل +"]');
    customerPaymentsRow.find('.balance-amount-input').val(customerPayments.toFixed(2));

    // مبلغ وارد من الإدارة + (من جدول وارد من الإدارة)
    const totalWarid = calculateWaridTotals();
    const mablaghWaridRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ وارد من الإدارة +"]');
    mablaghWaridRow.find('.balance-amount-input').val(totalWarid.toFixed(2));

    // مبلغ صادر مشتريات - (من جدول المشتريات نقدا فقط)
    let cashPurchases = 0;
    $('#movementTableBody tr.data-row').each(function () {
        const paymentType = $(this).find('.payment-type').val();
        const total = parseFloat($(this).find('.total-input').val()) || 0;
        if (paymentType === 'نقدا') {
            cashPurchases += total;
        }
    });
    const purchasesRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ صادر مشتريات -"]');
    purchasesRow.find('.balance-amount-input').val(cashPurchases.toFixed(2));

    // مبلغ صادر سداد وارد - (مدفوعات الموردين)
    let supplierPayments = 0;
    $('#suppliersTableBody tr.supplier-row').each(function () {
        const amount = parseFloat($(this).find('.supplier-amount-input').val()) || 0;
        supplierPayments += amount;
    });
    const supplierPaymentsRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ صادر سداد وارد -"]');
    supplierPaymentsRow.find('.balance-amount-input').val(supplierPayments.toFixed(2));

    // مبلغ مسحوب - (تسليم للإدارة)
    const totalTaslim = calculateTaslimTotals();
    const mablaghMashubRow = $('#balancesTable tbody tr.balance-row[data-type="مبلغ مسحوب تسليم للإدارة -"]');
    mablaghMashubRow.find('.balance-amount-input').val(totalTaslim.toFixed(2));

    // إجمالي المصروفات -
    const totalExpenses = parseFloat($('#grandTotalExpenses').text()) || 0;
    const totalExpensesRow = $('#balancesTable tbody tr.balance-row[data-type="إجمالي المصروفات -"]');
    totalExpensesRow.find('.balance-amount-input').val(totalExpenses.toFixed(2));

    // الإجماليات
    const totalPlus = cashSales + customerPayments + totalWarid;
    const totalMinus = cashPurchases + supplierPayments + totalTaslim + totalExpenses;

    // الرصيد المتوفر
    const availableBalance = rasidSabiq + totalPlus - totalMinus;
    $('#availableBalance').text(availableBalance.toFixed(2));

    // تلوين الرصيد
    let balance = parseFloat($('#availableBalance').text()) || 0;
    let cell = $('#availableBalance');
    cell.removeClass('balance-positive balance-negative');

    if (balance > 0) {
        cell.addClass('balance-positive');  // أخضر
    } else if (balance < 0) {
        cell.addClass('balance-negative'); // أحمر
    }

    return availableBalance;
}

// =====================================
// Updated Grand Summary with Taslim & Warid
// =====================================

// Calculate grand summary including Taslim & Warid
function calculateGrandSummary() {
    const purchasesTotal = parseFloat($('#grandTotal').text()) || 0;
    const expensesTotal = parseFloat($('#grandTotalExpenses').text()) || 0;
    const suppliersTotal = parseFloat($('#grandTotalSuppliers').text()) || 0;
    const customersTotal = parseFloat($('#grandTotalCustomers').text()) || 0;
    const taslimTotal = calculateTaslimTotals();
    const waridTotal = calculateWaridTotals();

    const grandTotalAll = purchasesTotal + expensesTotal + suppliersTotal + customersTotal + taslimTotal + waridTotal;

    $('#summaryPurchases').text(purchasesTotal.toFixed(2));
    $('#summaryExpenses').text(expensesTotal.toFixed(2));
    $('#summarySuppliers').text(suppliersTotal.toFixed(2));
    $('#summaryCustomers').text(customersTotal.toFixed(2));
    $('#summaryTaslim').text(taslimTotal.toFixed(2));
    $('#summaryWarid').text(waridTotal.toFixed(2));
    $('#grandTotalAll').text(grandTotalAll.toFixed(2));
}

// =====================================
// Updated Save Movement with Taslim & Warid
// =====================================

function saveMovement() {
    const details = [];
    const sales = [];
    const expenses = [];
    const suppliers = [];
    const customers = [];
    const taslim = [];
    const warid = [];
    const balances = [];
    let isValid = true;

    $('#salesTableBody tr.sales-row').each(function () {
        const productId = $(this).find('.sales-product-select').val();
        const quantity = parseFloat($(this).find('.sales-quantity-input').val()) || 0;
        const price = parseFloat($(this).find('.sales-price-input').val()) || 0;
        const total = parseFloat($(this).find('.sales-total-input').val()) || 0;
        const paymentType = $(this).find('.sales-payment-type').val();
        const notes = $(this).find('.sales-notes-input').val();

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
            icon: 'warning'
        });
        return;
    }

    // Collect purchase details
    $('#movementTableBody tr.data-row').each(function () {
        const productId = $(this).find('.product-select').val();
        const quantity = parseFloat($(this).find('.quantity-input').val()) || 0;
        const price = parseFloat($(this).find('.price-input').val()) || 0;
        const total = parseFloat($(this).find('.total-input').val()) || 0;
        const paymentType = $(this).find('.payment-type').val();
        const notes = $(this).find('.notes-input').val();

        if (!productId) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك اختر الصنف في جميع صفوف المشتريات',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        if (quantity <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل العدد بشكل صحيح في المشتريات',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
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

    // Collect customers
    $('#customersTableBody tr.customer-row').each(function () {
        const customerName = $(this).find('.customer-name-input').val() || '';
        const amount = parseFloat($(this).find('.customer-amount-input').val()) || 0;
        const notes = $(this).find('.customer-notes-input').val();

        if (!customerName) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك اختر العميل في جميع الصفوف',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        if (amount <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل المبلغ بشكل صحيح للعميل',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        customers.push({
            DailyMovementCustomer_CustomerID: 7,
            Customer_Name: customerName,
            DailyMovementCustomer_Amount: amount,
            DailyMovementCustomer_Notes: notes
        });
    });

    if (!isValid) return;

    // Collect expenses
    $('#expensesTableBody tr.expense-row').each(function () {
        //const categoryId = $(this).find('.expense-category-select').val();
        const categoryName = $(this).find('.expense-category-input').val().trim();
        const quantity = parseFloat($(this).find('.expense-quantity-input').val()) || 0;
        const amount = parseFloat($(this).find('.expense-amount-input').val()) || 0;
        const total = parseFloat($(this).find('.expense-total-input').val()) || 0;
        const notes = $(this).find('.expense-notes-input').val();

        console.log("Expense Category Name:", categoryName);
        if (!categoryName) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل اسم المصروف في جميع الصفوف',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        if (quantity <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل العدد بشكل صحيح في المصروفات',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        expenses.push({
            DailyMovementExpense_CategoryID: 1,
            DailyMovementExpense_CategoryName: categoryName, 
            DailyMovementExpense_Quantity: quantity,
            DailyMovementExpense_Amount: amount,
            DailyMovementExpense_Total: total,
            DailyMovementExpense_Notes: notes
        });
    });

    if (!isValid) return;

    // Collect suppliers
    $('#suppliersTableBody tr.supplier-row').each(function () {
        //const supplierId = $(this).find('.supplier-select').val();
        const supplierName = $(this).find('.supplier-name-input').val().trim();

        const amount = parseFloat($(this).find('.supplier-amount-input').val()) || 0;
        const notes = $(this).find('.supplier-notes-input').val();

        console.log("Supplier Name:", supplierName);

        if (!supplierName) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل اسم المورد في جميع الصفوف',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        if (amount <= 0) {
            Swal.fire({
                title: 'تنبيه',
                text: 'من فضلك أدخل المبلغ بشكل صحيح',
                icon: 'warning',
                confirmButtonText: 'موافق',
                customClass: {
                    confirmButton: 'btn fw-bold btn-primary'
                }
            });
            isValid = false;
            return false;
        }

        suppliers.push({
            DailyMovementSupplier_SupplierID: 1,
            Supplier_Name: supplierName,
            DailyMovementSupplier_SupplierName: supplierName,
            DailyMovementSupplier_Amount: amount,
            DailyMovementSupplier_Notes: notes
        });
    });

    if (!isValid) return;

    // ✅ Collect Taslim (تسليم للإدارة)
    $('#taslimTableBody tr.taslim-row').each(function () {
        const receiver = $(this).find('.taslim-receiver-input').val();
        const amount = parseFloat($(this).find('.taslim-amount-input').val()) || 0;
        const notes = $(this).find('.taslim-notes-input').val();

        if (amount > 0) {
            taslim.push({
                DailyMovementTaslim_Receiver: receiver,
                DailyMovementTaslim_Amount: amount,
                DailyMovementTaslim_Notes: notes
            });
        }
    });

    // ✅ Collect Warid (وارد من الإدارة)
    $('#waridTableBody tr.warid-row').each(function () {
        const receiver = $(this).find('.warid-receiver-input').val();
        const amount = parseFloat($(this).find('.warid-amount-input').val()) || 0;
        const notes = $(this).find('.warid-notes-input').val();

        if (amount > 0) {
            warid.push({
                DailyMovementWarid_Receiver: receiver,
                DailyMovementWarid_Amount: amount,
                DailyMovementWarid_Notes: notes
            });
        }
    });

    // Collect balances
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

    const currentUserId = $('#DailyMovement_UserID').val();

    const selectedDate = document.getElementById("dailyDate").value;
    console.log("Selected Date:", selectedDate);

    const data = {

        DailyMovement_UserID: currentUserId,
        DailyMovement_Date: selectedDate,
        Details: details,
        Sales: sales,
        Expenses: expenses,
        Suppliers: suppliers,
        Customers: customers,
        Taslim: taslim, // جديد
        Warid: warid, // جديد
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
                    title: 'خطأ',
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

// =====================================
// Initialize on Document Ready
// =====================================

$(document).ready(function () {
    // Calculate totals on page load


    calculateTaslimTotals();
    calculateWaridTotals();

    // Attach event handlers to existing rows
    attachTaslimRowEvents();
    attachWaridRowEvents();

    // Update balance auto calculation to include new tables
    $('.taslim-amount-input, .warid-amount-input').off('input change').on('input change', function () {
        setTimeout(calculateBalanceTotals, 100);
    });
});
function saveQuickProduct() {
    const name = $('#newProductName').val().trim();
    const price = parseFloat($('#newProductPrice').val()) || 0;

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم الصنف',
            icon: 'warning',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    // Show loading
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
                // Add to productsData array
                const newProduct = response.data.data;
                productsData.push(newProduct);

                // Rebuild products HTML
                window.productsHTML = buildProductsHTML();

                // Update all product selects
                $('.product-select').each(function () {
                    const currentValue = $(this).val();
                    $(this).html(window.productsHTML);
                    if (currentValue) {
                        $(this).val(currentValue);
                    }
                });

                // Close modal
                $('#quickAddProductModal').modal('hide');
                $('#quickAddProductForm')[0].reset();

                // Show success
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

// Save Quick Customer
function saveQuickCustomer() {
    const name = $('#newCustomerName').val().trim();
    const phone = $('#newCustomerPhone').val().trim();
    const address = $('#newCustomerAddress').val().trim();

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم العميل',
            icon: 'warning',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    // Show loading
    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const data = {
        Customer_Name: name,
        Customer_Phone: phone,
        Customer_Address: address
    };

    axios.post('/DailyMovement/QuickAddCustomer', data)
        .then(function (response) {
            if (response.data.isValid) {
                // Add to customersData array
                const newCustomer = response.data.data;
                customersData.push(newCustomer);

                // Rebuild customers HTML
                window.customersHTML = buildCustomersHTML();

                // Update all customer selects
                $('.customer-select').each(function () {
                    const currentValue = $(this).val();
                    $(this).html(window.customersHTML);
                    if (currentValue) {
                        $(this).val(currentValue);
                    }
                });

                // Close modal
                $('#quickAddCustomerModal').modal('hide');
                $('#quickAddCustomerForm')[0].reset();

                // Show success
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

// Save Quick Supplier
function saveQuickSupplier() {
    const name = $('#newSupplierName').val().trim();
    const phone = $('#newSupplierPhone').val().trim();
    const address = $('#newSupplierAddress').val().trim();

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم المورد',
            icon: 'warning',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    // Show loading
    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const data = {
        Supplier_Name: name,
        Supplier_Phone: phone,
        Supplier_Address: address
    };

    axios.post('/DailyMovement/QuickAddSupplier', data)
        .then(function (response) {
            if (response.data.isValid) {
                // Add to suppliersData array
                const newSupplier = response.data.data;
                suppliersData.push(newSupplier);

                // Rebuild suppliers HTML
                window.suppliersHTML = buildSuppliersHTML();

                // Update all supplier selects
                $('.supplier-select').each(function () {
                    const currentValue = $(this).val();
                    $(this).html(window.suppliersHTML);
                    if (currentValue) {
                        $(this).val(currentValue);
                    }
                });

                // Close modal
                $('#quickAddSupplierModal').modal('hide');
                $('#quickAddSupplierForm')[0].reset();

                // Show success
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

// Save Quick Expense Item
function saveQuickExpenseItem() {
    const name = $('#newExpenseName').val().trim();

    if (!name) {
        Swal.fire({
            title: 'تنبيه',
            text: 'من فضلك أدخل اسم البند',
            icon: 'warning',
            confirmButtonText: 'موافق',
            customClass: {
                confirmButton: 'btn fw-bold btn-primary'
            }
        });
        return;
    }

    // Show loading
    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const data = {
        ExpenseItem_Name: name
    };

    axios.post('/DailyMovement/QuickAddExpenseItem', data)
        .then(function (response) {
            if (response.data.isValid) {
                // Add to categoriesData array
                const newCategory = response.data.data;
                categoriesData.push(newCategory);

                // Rebuild categories HTML
                window.categoriesHTML = buildCategoriesHTML();

                // Update all expense category selects
                $('.expense-category-select').each(function () {
                    const currentValue = $(this).val();
                    $(this).html(window.categoriesHTML);
                    if (currentValue) {
                        $(this).val(currentValue);
                    }
                });

                // Close modal
                $('#quickAddExpenseModal').modal('hide');
                $('#quickAddExpenseForm')[0].reset();

                // Show success
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


$(document).ready(function () {

    attachBalanceAutoCalculation();

    // Check if productsHTML was set from the page
    if (!productsHTML) {
        // Get products HTML from hidden template
        const template = $('#productsTemplate select');
        if (template.length > 0) {
            productsHTML = template.html();
            console.log('Products loaded from template');
        } else {
            // Fallback: try to get from existing select
            const firstSelect = $('.product-select').first();
            if (firstSelect.length > 0) {
                productsHTML = firstSelect.html();
                console.log('Products loaded from existing select');
            } else {
                console.error('No products source found!');
            }
        }
        attachBalanceAutoCalculation();

        // ✅ إضافة هذا السطر لحساب الرصيد الأولي
        if (typeof balance !== 'undefined') {
            $("#availableBalance").text(balance.toFixed(2));
            updateBalanceUI();
        }
    } else {
        console.log('Products loaded from window.productsHTML');
    }

    // ✅ إضافة هذه الأسطر لحساب الإجماليات عند تحميل الصفحة
    setTimeout(function () {
        calculateTotals();
        calculateBalanceTotals();
        calculateGrandSummary();
    }, 500);

    // Attach event handlers to existing rows
    attachRowEvents();

    // ✅ إضافة event handlers للصفوف الموجودة مسبقاً
    $('#movementTableBody tr.data-row').each(function () {
        const row = $(this);
        // إعادة ربط الأحداث للحقول الموجودة
        row.find('.quantity-input, .price-input, .total-input, .payment-type').off('input change').on('input change', function () {
            calculateRowTotal(row);
            calculateTotals();
        });
    });

    // Debug: Check if products are loaded
    console.log('Products HTML length:', productsHTML.length);
    const optionsCount = (productsHTML.match(/<option/g) || []).length;
    console.log('Product options count:', optionsCount);




    $('#salesTableBody tr.sales-row').each(function () {
        const row = $(this);
        row.find('.sales-quantity-input, .sales-price-input, .sales-total-input, .sales-payment-type')
            .off('input change').on('input change', function () {
                calculateSalesRowTotal(row);
            });
    });

    // ربط أحداث المصروفات الموجودة مسبقاً
    $('#expensesTableBody tr.expense-row').each(function () {
        const row = $(this);

        row.find('.expense-category-input').off('input').on('input', function () {
        });

        row.find('.expense-quantity-input, .expense-amount-input, .expense-total-input')
            .off('input').on('input', function () {
                const quantity = parseFloat(row.find('.expense-quantity-input').val()) || 0;
                const amount = parseFloat(row.find('.expense-amount-input').val()) || 0;
                const total = quantity * amount;
                row.find('.expense-total-input').val(total.toFixed(2));
                calculateExpenseTotals();
                calculateBalanceTotals();  
                calculateGrandSummary();
            });
    });

    // ربط أحداث الموردين الموجودة مسبقاً
    $('#suppliersTableBody tr.supplier-row').each(function () {
        const row = $(this);

        row.find('.supplier-name-input').off('input').on('input', function () {
        });

        row.find('.supplier-amount-input')
            .off('input').on('input', function () {
                calculateSupplierTotals();
                calculateBalanceTotals();  
                calculateGrandSummary();
            });
    });

    // ربط أحداث العملاء الموجودة مسبقاً
    $('#customersTableBody tr.customer-row').each(function () {
        const row = $(this);

        row.find('.customer-name-input').off('input').on('input', function () {
        });

        row.find('.customer-amount-input')
            .off('input').on('input', function () {
                calculateCustomerTotals();
                calculateBalanceTotals();  
                calculateGrandSummary();
            });
    });

});
document.addEventListener('DOMContentLoaded', function () {
    // فعّل البحث على كل select من الكلاس product-select
    document.querySelectorAll('.product-select').forEach(function (el) {
        new Choices(el, {
            searchEnabled: true,
            itemSelectText: '',
            placeholderValue: 'اختر الصنف...',
            searchPlaceholderValue: 'اكتب للبحث...',
            removeItemButton: false,
            shouldSort: false,
            position: 'bottom',
            searchResultLimit: 10,
            noResultsText: 'لا توجد نتائج',
            noChoicesText: 'لا توجد عناصر',
            dir: 'rtl'
        });
    });
});