// Este módulo implementa la gestión del modelo de datos a partir de las accciones de usuario obtenidas desde el control
//import {NewModule} from 'movies/movie-add';
//import {EditModule} from 'movies/movie-edit';
//import {DeleteModule} from 'movies/movie-delete';
//import {ShowModule} from 'movies/movie-show';

var MovieModule = (function () {
    // INI Gestor CRUD de peliculas con IndexedDB
    var allMovies = function () {
        return ShowModule.check();
    };
    var addMovie = function () {
        NewModule.clear();
        // Obtener los elementos del formulario y trasladarlos a un objeto
        var movieRec = NewModule.getValues();
        NewModule.check(movieRec);
        NewModule.clear();
    };
    var saveMovie = function () {
        // Obtener los elementos del formulario y trasladarlos a un objeto
        var movieRec = NewModule.getValues();
        NewModule.add(movieRec);
        NewModule.clear();
    };
    var editMovie = function () {
        // Limpiar la página de contenido
        EditModule.clear();
        //  Cargar de los elementos del menú
        var MovieId = $('#pgEditMovie').data('id');
        // Lectura de los elementos desde la base de datos y refresco de la pantalla
        EditModule.edit(MovieId);
    };
    var updateMovie = function () {
        //get contents of Edit page controls
        var movieRec = EditModule.getValues();
        // Actualzar los valores del registro
        EditModule.update(movieRec);
    };
    var deleteMovie = function (movie) {
        // Eliminar un registro
        DeleteModule.delete(movie);
    };
    // FIN Gestor CRUD de peliculas con IndexedDB

    return {
        add: addMovie,
        save: saveMovie,
        edit: editMovie,
        update: updateMovie,
        deleteMovie: deleteMovie,
        getAll: allMovies
    };
}());