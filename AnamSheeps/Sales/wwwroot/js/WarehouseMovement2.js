"use strict";


let mortalityDataTable;
let livestockDataTable;
let outgoingDataTable;
let productsSelectHtml = '';
let delegatesSelectHtml = '';

const dataTableConfig = {
    responsive: true,
    processing: true,
    searching: false,
    paging: false,
    info: false,
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
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "الكل"]],
    "pageLength": 50,
    'order': [],
    fixedHeader: {
        header: true
    }
};


function initMortalityTable() {


    function attachMortalityRowEvents() {
        $('.quantity-input').off('input').on('input', function () {
            calculateMortalityTotals();
        });
    }

    function calculateMortalityTotals() {
        let totalQuantity = 0;

        $('#mortalityTable tbody tr').each(function () {
            const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
            totalQuantity += quantity;
        });

        $('#mortalityTotalQuantity').text(totalQuantity);
    }


    function addMortalityRow() {
        if (typeof mortalityDataTable === 'undefined' || !mortalityDataTable) {
            console.error('DataTable not initialized!');
            return;
        }

        const newRowData = {
            id: null,
            productId: null,
            quantity: 0,
            notes: ''
        };

        try {
            mortalityDataTable.row.add(newRowData).draw(false);

            // ✅ انتظر شوية أطول عشان الـ DOM يتحدث
            setTimeout(() => {
                const newRow = mortalityDataTable.row(':last').node();
                if (newRow) {
                    const selectElement = newRow.querySelector('.product-select');
                    if (selectElement) {
                        initializeChoicesForSelect(selectElement);
                        console.log('✅ New mortality row added with Choices');
                    }
                }
            }, 200); // ✅ زودنا الوقت من 100 لـ 200

        } catch (error) {
            console.error('Error adding row:', error);
        }
    }

    function deleteMortalityRow(button) {
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
                mortalityDataTable.row(row).remove().draw(false);
                calculateMortalityTotals();
            }
        });
    }


    const table = document.getElementById('mortalityTable');
    if (!table) {
        console.warn('⚠️ Mortality table not found');
        return;
    }

    console.log('✅ Initializing mortalityTable...');

    mortalityDataTable = $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": "/WarehouseMovement/GetMortalities",
            "dataSrc": function (response) {
                if (response.success) {
                    return response.data;
                } else {
                    console.warn('⚠️ No mortality data:', response.message);
                    return [];
                }
            }
        },
        'columnDefs': [
            { targets: [0, 4], orderable: false, searchable: false, className: "text-center" },
            { targets: [2], className: "text-center" }
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
                "render": function (data) {
                    return `<select class="form-select form-select-sm product-select">
                                ${productsSelectHtml}
                            </select>`;
                }
            },
            {
                "data": "quantity",
                "render": function (data) {
                    return `<input type="number" class="form-control form-control-sm text-center quantity-input" 
                                   min="0" value="${data || ''}" />`;
                }
            },
            {
                "data": "notes",
                "render": function (data) {
                    return `<input type="text" class="form-control form-select-sm notes-input" value="${data || ''}" />`;
                }
            },
            {
                "data": null,
                "render": function () {
                    return `<button type="button" class="btn btn-sm btn-danger btn-icon delete-mortality-btn" >
                                <i class="fa-solid fa-trash fs-4"></i>
                            </button>`;
                }
            }
        ],
        "drawCallback": function () {
            // تعيين القيم للـ selects بعد تحميل البيانات
            this.api().rows().every(function (rowIdx) {
                const rowData = this.data();
                const rowNode = this.node();

                $(rowNode).find('.product-select').val(rowData.productId);
            });

            setTimeout(() => {
                initializeAllSelects();
            }, 100);

            attachMortalityRowEvents();
            $(".delete-mortality-btn").off("click").on("click", function () {
                deleteMortalityRow(this);
            });
            calculateMortalityTotals();
        }
    });

    $("#addMortalityRowBtn").off("click").on("click", addMortalityRow);
}

function initLivestockTable() {

    function addLivestockRow() {
        if (typeof livestockDataTable === 'undefined' || !livestockDataTable) {
            console.error('DataTable not initialized!');
            return;
        }

        const newRowData = {
            id: null,
            productId: null,
            quantity: 0,
            notes: ''
        };

        try {
            livestockDataTable.row.add(newRowData).draw(false);

            setTimeout(() => {
                const newRow = livestockDataTable.row(':last').node();
                if (newRow) {
                    const selectElement = newRow.querySelector('.product-select');
                    if (selectElement) {
                        initializeChoicesForSelect(selectElement);
                        console.log('✅ New livestock row added with Choices');
                    }
                }
            }, 200);
        } catch (error) {
            console.error('Error adding row:', error);
        }
    }


    function deleteLivestockRow(button) {
        Swal.fire({
            title: 'هل أنت متأكد؟',
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
                livestockDataTable.row(row).remove().draw(false);
                calculateLivestockTotals();
            }
        });
    }

    function attachLivestockRowEvents() {
        $('.quantity-input').off('input').on('input', function () {
            calculateLivestockTotals();
        });
    }

    function calculateLivestockTotals() {
        let totalQuantity = 0;

        $('#livestockTable tbody tr').each(function () {
            const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
            totalQuantity += quantity;
        });

        $('#livestockTotalQuantity').text(totalQuantity);
    }


    const table = document.getElementById('livestockTable');
    if (!table) {
        console.warn('⚠️ Livestock table not found');
        return;
    }

    console.log('✅ Initializing livestockTable...');

    livestockDataTable = $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": "/WarehouseMovement/GetLivestocks",
            "dataSrc": function (response) {
                return response.success ? response.data : [];
            }
        },
        'columnDefs': [
            { targets: [0, 4], orderable: false, searchable: false, className: "text-center" },
            { targets: [2], className: "text-center" }
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
                "render": function (data) {
                    return `<select class="form-select form-select-sm product-select">
                                ${productsSelectHtml}
                            </select>`;
                }
            },
            {
                "data": "quantity",
                "render": function (data) {
                    return `<input type="number" class="form-control form-control-sm text-center quantity-input" 
                                   min="0" value="${data || ''}" />`;
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
                    return `<button type="button" class="btn btn-sm btn-danger btn-icon delete-livestock-btn">
                                <i class="fa-solid fa-trash fs-4"></i>
                            </button>`;
                }
            }
        ],
        "drawCallback": function () {
            this.api().rows().every(function (rowIdx) {
                const rowData = this.data();
                const rowNode = this.node();
                $(rowNode).find('.product-select').val(rowData.productId);
            });


            setTimeout(() => {
                initializeAllSelects();
            }, 100);

            attachLivestockRowEvents();
            $(".delete-livestock-btn").off("click").on("click", function () {
                deleteLivestockRow(this);
            });
            calculateLivestockTotals();
        }
    });

    $("#addlivestockTableRowBtn").off("click").on("click", addLivestockRow);

}

function initOutgoingTable() {

    function addOutgoingRow() {
        if (typeof outgoingDataTable === 'undefined' || !outgoingDataTable) {
            console.error('DataTable not initialized!');
            return;
        }

        const newRowData = {
            id: null,
            delegateName: null,
            productId: null,
            quantity: 0,
            notes: ''
        };

        try {
            outgoingDataTable.row.add(newRowData).draw(false);

            setTimeout(() => {
                const newRow = outgoingDataTable.row(':last').node();
                if (newRow) {
                    const productSelect = newRow.querySelector('.product-select');
                    const delegateSelect = newRow.querySelector('.delegate-select');

                    if (productSelect) {
                        initializeChoicesForSelect(productSelect);
                    }
                    if (delegateSelect) {
                        initializeChoicesForSelect(delegateSelect);
                    }
                    console.log('✅ New outgoing row added with Choices');
                }
            }, 200);
        } catch (error) {
            console.error('Error adding row:', error);
        }
    }

    function deleteOutgoingRow(button) {
        Swal.fire({
            title: 'هل أنت متأكد؟',
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
                outgoingDataTable.row(row).remove().draw(false);
                calculateOutgoingTotals();
            }
        });
    }


    function attachOutgoingRowEvents() {
        $('.quantity-input').off('input').on('input', function () {
            calculateOutgoingTotals();
        });
    }

    function calculateOutgoingTotals() {
        let totalQuantity = 0;

        $('#outgoingTable tbody tr').each(function () {
            const quantity = parseInt($(this).find('.quantity-input').val()) || 0;
            totalQuantity += quantity;
        });

        $('#outgoingTotalQuantity').text(totalQuantity);
    }


    const table = document.getElementById('outgoingTable');
    if (!table) {
        console.warn('⚠️ Outgoing table not found');
        return;
    }

    console.log('✅ Initializing outgoingTable...');

    outgoingDataTable = $(table).DataTable({
        ...dataTableConfig,
        "ajax": {
            "url": "/WarehouseMovement/GetOutgoings",
            "dataSrc": function (response) {
                return response.success ? response.data : [];
            }
        },
        'columnDefs': [
            { targets: [0, 5], orderable: false, searchable: false, className: "text-center" },
            { targets: [3], className: "text-center" }
        ],
        "columns": [
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                "data": "delegateName",
                "render": function (data) {
                    return `<select class="form-select form-select-sm delegate-select">
                                ${delegatesSelectHtml}
                            </select>`;
                }
            },
            {
                "data": "productId",
                "render": function (data) {
                    return `<select class="form-select form-select-sm product-select">
                                ${productsSelectHtml}
                            </select>`;
                }
            },
            {
                "data": "quantity",
                "render": function (data) {
                    return `<input type="number" class="form-control form-control-sm text-center quantity-input" 
                                   min="0" value="${data || ''}" />`;
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
                    return `<button type="button" class="btn btn-sm btn-danger btn-icon delete-Outgoing-btn">
                                <i class="fa-solid fa-trash fs-4"></i>
                            </button>`;
                }
            }
        ],
        "drawCallback": function () {
            this.api().rows().every(function (rowIdx) {
                const rowData = this.data();
                const rowNode = this.node();

                $(rowNode).find('.delegate-select').val(rowData.delegateName);
                $(rowNode).find('.product-select').val(rowData.productId);
            });

            setTimeout(() => {
                initializeAllSelects();
            }, 100);

            attachOutgoingRowEvents();
            $(".delete-Outgoing-btn").off("click").on("click", function () {
                deleteOutgoingRow(this);
            });
            calculateOutgoingTotals();
        }
    });

    $("#addoutgoingRowBtn").off("click").on("click", addOutgoingRow);

}



function saveAllMovement() {
    const mortalities = [];
    const livestocks = [];
    const outgoings = [];

    // جمع بيانات النفوق والمستهلك
    if (mortalityDataTable) {
        mortalityDataTable.rows().every(function () {
            const rowNode = this.node();

            // ✅ قراءة القيمة من Choices.js أو من الـ select مباشرة
            const productSelect = $(rowNode).find('.product-select')[0];
            let productId = 0;

            if (productSelect._choices) {
                productId = parseInt(productSelect._choices.getValue(true)) || 0;
            } else {
                productId = parseInt($(productSelect).val()) || 0;
            }

            const quantity = parseInt($(rowNode).find('.quantity-input').val()) || 0;
            const notes = $(rowNode).find('.notes-input').val() || "";

            if (productId > 0 && quantity > 0) {
                mortalities.push({
                    WarehouseMortality_ProductID: productId,
                    WarehouseMortality_Quantity: quantity,
                    WarehouseMortality_Notes: notes
                });
            }
        });
    }

    // جمع بيانات الحلال الموجود
    if (livestockDataTable) {
        livestockDataTable.rows().every(function () {
            const rowNode = this.node();

            const productSelect = $(rowNode).find('.product-select')[0];
            let productId = 0;

            if (productSelect._choices) {
                productId = parseInt(productSelect._choices.getValue(true)) || 0;
            } else {
                productId = parseInt($(productSelect).val()) || 0;
            }

            const quantity = parseInt($(rowNode).find('.quantity-input').val()) || 0;
            const notes = $(rowNode).find('.notes-input').val() || "";

            if (productId > 0 && quantity > 0) {
                livestocks.push({
                    WarehouseLivestock_ProductID: productId,
                    WarehouseLivestock_Quantity: quantity,
                    WarehouseLivestock_Notes: notes
                });
            }
        });
    }

    // جمع بيانات الخارج من المزرعة
    if (outgoingDataTable) {
        outgoingDataTable.rows().every(function () {
            const rowNode = this.node();

            // ✅ قراءة المندوب
            const delegateSelect = $(rowNode).find('.delegate-select')[0];
            let delegateName = "";

            if (delegateSelect._choices) {
                delegateName = delegateSelect._choices.getValue(true) || "";
            } else {
                delegateName = $(delegateSelect).val() || "";
            }

            // ✅ قراءة الصنف
            const productSelect = $(rowNode).find('.product-select')[0];
            let productId = 0;

            if (productSelect._choices) {
                productId = parseInt(productSelect._choices.getValue(true)) || 0;
            } else {
                productId = parseInt($(productSelect).val()) || 0;
            }

            const quantity = parseInt($(rowNode).find('.quantity-input').val()) || 0;
            const notes = $(rowNode).find('.notes-input').val() || "";

            if (delegateName && productId > 0 && quantity > 0) {
                outgoings.push({
                    WarehouseOutgoing_DelegateName: delegateName,
                    WarehouseOutgoing_ProductID: productId,
                    WarehouseOutgoing_Quantity: quantity,
                    WarehouseOutgoing_Notes: notes
                });
            }
        });
    }

    // ✅ إضافة console.log للتأكد من البيانات
    console.log('📊 Data to save:', {
        mortalities: mortalities,
        livestocks: livestocks,
        outgoings: outgoings
    });

    const data = {
        Mortalities: mortalities,
        Livestocks: livestocks,
        Outgoings: outgoings
    };

    // Show loading
    Swal.fire({
        title: 'جاري الحفظ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

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


$(document).ready(function () {
    console.log('🚀 Initializing Warehouse Movement...');

    if (typeof jQuery === 'undefined') {
        console.error('❌ jQuery is not loaded!');
        return;
    }
    console.log('✅ jQuery loaded:', jQuery.fn.jquery);

    if (typeof $.fn.DataTable === 'undefined') {
        console.error('❌ DataTables is not loaded!');
        return;
    }
    console.log('✅ DataTables loaded:', $.fn.DataTable.version);

    const productsTemplate = $('#productsTemplate select');
    if (productsTemplate.length > 0) {
        productsSelectHtml = productsTemplate.html();
        console.log('✅ Products loaded');
    } else {
        console.error('❌ Products template not found!');
    }

    const delegatesTemplate = $('#delegatesTemplate select');
    if (delegatesTemplate.length > 0) {
        delegatesSelectHtml = delegatesTemplate.html();
        console.log('✅ Delegates loaded');
    } else {
        console.warn('⚠️ Delegates template not found');
    }

    try {
        if ($('#mortalityTable').length > 0) {
            initMortalityTable();
            console.log('✅ Mortality table initialized');
        }

        if ($('#livestockTable').length > 0) {
            initLivestockTable();
            console.log('✅ Livestock table initialized');
        }

        if ($('#outgoingTable').length > 0) {
            initOutgoingTable();
            console.log('✅ Outgoing table initialized');
        }
    } catch (error) {
        console.error('❌ Error initializing tables:', error);
        return;
    }

    console.log('✅ All tables initialized successfully');

    calculateMortalityTotals();
    calculateLivestockTotals();
    calculateOutgoingTotals();
});



function initializeChoicesForSelect(selectElement) {
    if (!selectElement) {
        console.warn('⚠️ Select element is null');
        return;
    }

    // ✅ إذا كان عنده Choices بالفعل، destroy الأول
    if (selectElement._choices) {
        try {
            selectElement._choices.destroy();
        } catch (e) {
            console.warn('Error destroying choices:', e);
        }
    }

    try {
        const choices = new Choices(selectElement, {
            searchEnabled: true,
            itemSelectText: '',
            placeholderValue: 'اختر...',
            searchPlaceholderValue: 'اكتب للبحث...',
            shouldSort: false,
            position: 'bottom',
            searchResultLimit: 10,
            noResultsText: 'لا توجد نتائج',
            noChoicesText: 'لا توجد عناصر',
            loadingText: 'جارٍ التحميل...',
            removeItemButton: false, // ✅ غيرتها لـ false عشان متعملش مشاكل
            classNames: {
                containerInner: 'choices__inner',
                input: 'choices__input',
                list: 'choices__list',
                listSingle: 'choices__list--single',
                listDropdown: 'choices__list--dropdown'
            },
            dir: 'rtl'
        });

        selectElement._choices = choices;

        console.log('✅ Choices initialized for select');
    } catch (error) {
        console.error('❌ Error initializing Choices:', error);
    }
}


