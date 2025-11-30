//function printReport() {
//    window.print();
//}

function printReport() {
    document.body.classList.add('printing-active'); 

    setTimeout(function () {
        window.print();
    }, 50);

    window.onafterprint = function () {
        document.body.classList.remove('printing-active');
    };
}
