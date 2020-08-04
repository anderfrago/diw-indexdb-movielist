// Accedemos al modulo gestor de la vista de la página AddMovie
//import {MovieAddView} from 'movie-add-view.js';
//import {MovieView} from 'movie-view.js';



var NewModule = (function () {
    
     var addMovie = function (movieRec)  {
            $.mobile.loading("show", {
                text: "Creando el registro...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Limpiar el identificador almacenado con anterioridad
            var movieName = movieRec.movieName;
            movieName = movieName.split(' ').join('-');
            movieRec.movieName = movieName;
            // Guardar el objeto JSON en la base de datos
            // definir la transacción a ejecutar
            var tx = PersistenceManager.get().transaction(["Movie"], "readwrite");
            // Obtener los objetos para añadir un nuevo elemento
            var store = tx.objectStore("Movie");
            // añadir al almacenamiento de anteriores elementos
            var request = store.add(movieRec);
            request.onsuccess = function (e) {
                // En caso de exito en el almacecnamiento mostramoms un mensaje de notificación al usuario
                alert('El registro se ha almacenado exitosamente.', 'Nueva película');
                // Obtener desde la página de la que hemos accedido, en caso de que sea desde la de acceso volvemos a ella
                var pgFrom = $('#pgAddMovie').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
                        // En caso de disponer de una pantalla de registro lo gestionaríamos desde aquí
                        // $.mobile.changePage('#pgSignIn', { transition: pgtransition });
                        break;
                    default:
                        // limpiamos los elemntos del formulario
                          MovieAddView.pgAddMovieClear();
                        // Nos mantenemos en la misma página para seguir generando registros
                }
            }
            request.onerror = function (e) {
                // Mostramos un mensaje de notificación de error 
                alert('No se ha añadido la película.', 'Nueva película');
            }
            $.mobile.loading("hide");
        };
    
    var  pgAddMoviedisplayMovieR = function (movieObj) {
            $.mobile.loading("show", {
                text: "Mostrando registros...",
                textVisible: true, 
                textonly: false, 
                html: ""
            });
            var html = '';
            var n;
            for (n in movieObj) {
                var movieRec = movieObj[n];
                var pkey = movieRec.movieName;
                pkey = pkey.split('-').join(' ');
                movieRec.MovieName = pkey;
                var nItem = MovieLiRi;
                nItem = nItem.replace(/Z2/g,n);
                var nTitle = '';
                nTitle = n.split('-').join(' ');
                nItem = nItem.replace(/Z1/g,nTitle);
                html += nItem;
            }
            
        };
        
      // ********************************************************** 9
        /// INI VERIFICAR EL ALMACENAMIENTO DE LOS REGISTROS despues de AÑADIR UN NUEVO ELEMENTO
        // Mostrar los registros en caso de existir, sino notificarselo al  usuario
        var pgAddMoviecheckForMovieStorageR = function () {
            $.mobile.loading("show", {
                text: "Analizando base de datos...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //Obtener los registros desde la base de datos
            // en caso  de disponer registros, genera un objeto JSON por cada uno de ellos
            var MovieObj = {};
            // Definir la transacción para realizar la lectura de elementos de la base de datos
            var tx = PersistenceManager.get().transaction(["Movie"], "readonly");
            // Obtener el objeto encadao de almancenar los elementos en la base de datos
            var store = tx.objectStore("Movie");
            // Abrir un cursor para realizar la lectura de cada uno de los registros
            var request = store.openCursor();
            request.onsuccess = function (e) {
                // Retornar el resutlado
                var cursor = e.target.result;
                if (cursor) {
                    MovieObj[cursor.key] = cursor.value;
                    // procesar el siguiente registro
                    cursor.continue();
                }
                // Existen más peliculas?
                if (!$.isEmptyObject(MovieObj)) {
                    // encaso de que existan pasamos a visualizarlas
                    pgAddMoviedisplayMovieR(MovieObj);
                } else {
                    // en caso de que no existan solo mostramos el texto de ayuda
                    $('#pgAddMovieRightPnlLV').html(MovieView.getMovieHdr() + MovieView.getnoMovie()).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // en caso de encontrar un error
            request.onerror = function (e) {
                $.mobile.loading("hide");
                // solo se visualiza el texto de ayuda
                $('#pgAddMovieRightPnlLV').html(MovieView.getMovieHdr() + MovieView.getnoMovie()).listview('refresh');
            }
        };
        // FIN VERIFICAR EL ALMACENAMIENTO DE LOS REGISTROS despues de AÑADIR UN NUEVO ELEMENTO
        // ********************************************************** 
      
      var clearAddMovie= function(){
          // limpiamos los elementos
          MovieAddView.pgAddMovieClear();
      };
      
      var getRecAddMovie = function(){
          // obtenemos los registros
         return MovieAddView.pgAddMovieGetRec();
      };
    
    return {
        add: addMovie,
        check: pgAddMoviecheckForMovieStorageR,
        display: pgAddMoviedisplayMovieR,
        clear:  clearAddMovie,
        getValues: getRecAddMovie
    };
}());