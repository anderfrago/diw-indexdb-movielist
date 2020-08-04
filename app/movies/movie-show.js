// Accedemos al modulo gestor de la vista de la página AddMovie
//import {MovieShowView} from 'movie-show-view.js';
//import {MovieView} from 'movie-view.js';

var ShowModule = (function () {
    
        displayMovie = function (MovieObj) {
            $.mobile.loading("show", {
                text: "Mostrando elementos...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Se genera un string vacío para contener la información 
            var html = '';
            // Asegurarse de que el iterador esta bien definidio 
            var n;
            // Bucle sobre los registros generador de un elemento cada vez
            // añadir el html generado al final de la lista de elementos
            for (n in MovieObj) {
                // Obtener los detalles de elemento
                var movieRec = MovieObj[n];
                // Vaciar la llave primiaria
                var pkey = movieRec.movieName;
                pkey = pkey.split('-').join(' ');
                movieRec.movieName = pkey;
                // Definir una nueva lína de la información obtenida
                var nItem = MovieView.getMovieLi();
                nItem = nItem.replace(/Z2/g, n);
                // Actualizar el  título, puede que sea multilínea
                var nTitle = '';
                // Asignar un título vacío
                nTitle = n.split('-').join(' ');
                // Reemplazar el título
                nItem = nItem.replace(/Z1/g, nTitle);
                // Contador númerico de la película
                var nCountBubble = '';
                nCountBubble += movieRec.movieYear;
                // reemplazar el contador de elemntos 
                nItem = nItem.replace(/COUNTBUBBLE/g, nCountBubble);
                // Actualizr la vista en cado de existir descripción
                var nDescription = '';
                nDescription += movieRec.movieGenre;
                // Reemplazar la descripción
                nItem = nItem.replace(/DESCRIPTION/g, nDescription);
                html += nItem;
            }
            // Actualizar la vista con la nueva estructura HTML geerada
            $('#listMovies').html(MovieView.getMovieHdr() + html).listview('refresh');
            $.mobile.loading("hide");
        };
    
    
        checkForMovieStorage = function () {
            $.mobile.loading("show", {
                text: "Analizando base de datos...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Obtener los registros de la base de datos IndexDB
            // cuando se retornan objetos estos se convierten en objetos JSON
            var movieObj = {};
            // Se define una transacción para la lectura de elementos desde la base de datos
            var tx = PersistenceManager.get().transaction(["Movie"], "readonly");
            // Obtener el objeto alamcenador de la tabla de base de datos
            var store = tx.objectStore("Movie");
            // Abrir un cursor para la lectura de todos los registros de base de datos
            var request = store.openCursor();
            request.onsuccess = function (e) {
                // Se devuleve el resultado
                var cursor = e.target.result;
                if (cursor) {
                    movieObj[cursor.key] = cursor.value;
                    // Se procesa el siguiente registro
                    cursor.continue();
                }
                // Exten registros en la base de datos?
                if (!$.isEmptyObject(movieObj)) {
                    // yes there are. pass them off to be displayed
                    displayMovie(movieObj);
                } else {
                    // NO existes, mostramos el texto de ayuda
                    $('#listMovies').html(MovieView.getMovieHdr() + MovieView.getnoMovie()).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // se ha encontrado un error
            request.onerror = function (e) {
                $.mobile.loading("hide");
                // mostrar solo el texto de ayuda
                $('#listMovies').html(MovieView.getMovieHdr() + MovieView.getnoMovie()).listview('refresh');
            }
        };
    
    return {
        show: displayMovie,
        check: checkForMovieStorage
    };
}());