//import PersistenceManager from 'database/persistence-manager';
//import { MovieBindings } from 'controller/movie-controller';

$(function () {
    

    PersistenceManager.connect();

    // INI CONTROLADOR
    var controller = new MovieBindings();
    // Función encargada de la gestión de los eventos de usuario
    // 1: Ejecución antes de que se haya cargado la página, previo a mostrar la lista de elementos al usuario
    $(document).on('pagebeforechange', function (e, data) {
        controller.load(e, data);
    });
    // 2: Ejecución una vez que se ha cargado la página
    $(document).on('pagecontainershow', function (e, ui) {   
        controller.show(e, ui);
    });
    // FIN CONTROLADOR
    
});
