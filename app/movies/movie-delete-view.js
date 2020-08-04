$(function () {
    
    /// INI Gestión de mensaje alerta
    $('#msgboxyes').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // Se almacena el metodo que se ha lanzado en la alerta
        var yesmethod = $('#msgboxyes').data('method');
        // Se almacena la respuesta del usuario
        var yesid = $('#msgboxyes').data('id');
        // Se trasladan estos valores a app 
        MovieModule[yesmethod](yesid);
    });
    $('#msgboxno').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var nomethod = $('#msgboxno').data('method');
        var noid = $('#msgboxno').data('id');
        var toPage = $('#msgboxno').data('topage');
        // Redirecciona a la página anterior depues de realizar el borrado del registro
        $.mobile.changePage('#' + toPage, {transition: pgtransition});
        MovieModule[nomethod](noid);
    });
    $('#alertboxok').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var toPage = $('#alertboxok').data('topage');
        // show the page to display after ok is clicked
        $.mobile.changePage('#' + toPage, {transition: pgtransition});
    });
    /// FIN Gestión de mensaje alerta
})