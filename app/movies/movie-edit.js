// Accedemos al modulo gestor de la vista de la página AddMovie
//import {MovieEditView} from 'movie-edit-view.js';
//import {MovieView} from 'movie-view.js';﻿

var EditModule = (function () {

    // INI ACTUALIZAR UN ELEMENTO DE IndexedDB
    // Proceso de actualización de los registros de base de datos definidos desde la pantalla de edición
    updateMovie = function(MovieRec) {
        // Mostrar mensaje de cargando durante la ejecución del proceso
        $.mobile.loading("show", {
            text: "Update record...",
            textVisible: true,
            textonly: false,
            html: ""
        });
        // Buscar una película específica 
        var movieName = MovieRec.movieName;
        // Formatear el identificador eliminando los espacios
        movieName = movieName.split(' ').join('-');
        MovieRec.movieName =movieName;
        // Definir la transacción a ejectura
        var tx =  PersistenceManager.get().transaction(["Movie"], "readwrite");
        // Obtener el objeto store de almacenar los elemntos
        var store = tx.objectStore("Movie");
        // Obtener los registros desde el objeto encargado de almacenarlos
        store.get(movieName).onsuccess = function (e) {
            var request = store.put(MovieRec);
            request.onsuccess = function (e) {
                // El registro a sido guardado
                alert('Película actualizada.', 'PeliDB');
                // Limpiamos los elementos del formulario
                clearEditMovie();
                // Mostrar la pantalla de listado de los elementos de base de datos
                $.mobile.changePage('#pgMovieList', {transition: 'slide'});
            }
            request.onerror = function (e) {
                alert('No se ha actualizado la película, intentelo otra vez.', 'PeliDB');
                return;
            }
        };
        // Ocultamos el objeto de CARGANDO y mostramos el resultado
        $.mobile.loading("hide");
    };

    // Muestra el elemento seleccionado desde la pantalla de listado de elementos
    // Realiza la visualización en la pantalla de edición
    editMovie = function (movieName) {
        $.mobile.loading("show", {
            text: "Lectura de registros...",
            textVisible: true,
            textonly: false,
            html: ""
        });
        // Realizamos el vaciado de los valores introducidos por el usuario
        //clearEditMovie();
        movieName = movieName.split(' ').join('-');
        var MovieRec = {};
        // Se relaiza una transacción para la lectura de los valores de base de datos
        var tx =  PersistenceManager.get().transaction(["Movie"], "readonly");
        // Se obtiene el objeto encargado de leer el almacenamiento
        var store = tx.objectStore("Movie");
        // Se realiza la busqueda del elemento a traves de su clave primaria
        var request = store.get(movieName);
        request.onsuccess = function (e) {
            MovieRec = e.target.result;
            // En caso de que todo sea correcto preparmos la visualización
            // La clave primaria es de solo lectura
            $('#pgEditMovieMovieName').attr('readonly', 'readonly');
            // La clave primaria no puede ser borrada
            $('#pgEditMovieMovieName').attr('data-clear-btn', 'false');
            // Actualiza cada uno de los controles de la pantalla de edición
            // Damos formato a la clave primaria del registr, eliminando espacios en blanco y caracter -
            var pkey = MovieRec.movieName;
            pkey = pkey.split('-').join(' ');
            MovieRec.movieName = pkey;
            $('#pgEditMovieMovieName').val(MovieRec.movieName);
            $('#pgEditMovieMovieYear').val(MovieRec.movieYear);
            $('#pgEditMovieMovieGenre').val(MovieRec.movieGenre);
        }
        // En caso de encontrar un error se lo notificamos al usuario
        request.onerror = function (e) {
            $('#alertboxheader h1').text('Error PeliDB');
            $('#alertboxtitle').text(movieName.split('-').join(' '));
            $('#alertboxprompt').text('Se ha encontrado un error al realizar la lectura del valor, intentelo otra vez!');
            $('#alertboxok').data('topage', 'pgEditMovie');
            $('#alertboxok').data('id', movieName.split(' ').join('-'));
            $.mobile.changePage('#alertbox', {transition: 'pop'});
            return;
        }
        $.mobile.loading("hide");
    };
    // Realizar la lectura de los registros de la base de datos y mostrarlos en la pantalla de edición
    pgEditMovieeditMovie = function (MovieName) {
        $.mobile.loading("show", {
            text: "Lectura de elementos...",
            textVisible: true,
            textonly: false,
            html: ""
        });
        // Se vacian los elementos del formulario
        clearEditMovie();
        MovieName = MovieName.split(' ').join('-');
        var MovieRec = {};
        // Se define una transacción para realizar la lectura desde la base de datos
        var tx = PersistenceManager.get().transaction(["Movie"], "readonly");
        // Obtenemos el objeto almacenador de la tabla Movie
        var store = tx.objectStore("Movie");
        // Obtenemos el registro a partir de su clave primaria
        var request = store.get(movieName);
        request.onsuccess = function (e) {
            MovieRec = e.target.result;
            // En caso de que todo este correcto
            // Establecemos la clave primaria de solo lectura
            $('#pgEditMovieMovieName').attr('readonly', 'readonly');
            // Establecemos que la clave primaria no pueda ser borrada
            $('#pgEditMovieMovieName').attr('data-clear-btn', 'false');
            // Se actualizan cada uno de los controles de la ventana de edición
            // Se formatea y vacía la clave primaria
            var pkey = MovieRec.movieName;
            pkey = pkey.split('-').join(' ');
            MovieRec.MovieName = pkey;
            $('#pgEditMovieMovieName').val(MovieRec.movieName);
            $('#pgEditMovieMovieYear').val(MovieRec.movieYear);
            $('#pgEditMovieMovieGenre').val(MovieRec.movieGenre);
        }
        // Se ha encontrado un error
        request.onerror = function (e) {
            $('#alertboxheader h1').text('Movie Error');
            $('#alertboxtitle').text(movieName.split('-').join(' '));
            $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
            $('#alertboxok').data('topage', 'pgEditMovie');
            $('#alertboxok').data('id', movieName.split(' ').join('-'));
            $.mobile.changePage('#alertbox', {transition: 'pop'});
            return;
        }
        $.mobile.loading("hide");
    };
    var clearEditMovie = function () {
        // limpiamos los elementos
        MovieEditView.pgEditMovieClear();
    };
    var getRecEditMovie = function () {
        // obtenemos los registros
      return  MovieEditView.pgEditMovieGetRec();
    };

    return {
        update: updateMovie,
        edit: editMovie,
        display: pgEditMovieeditMovie,
        clear: clearEditMovie,
        getValues: getRecEditMovie
    };
}());