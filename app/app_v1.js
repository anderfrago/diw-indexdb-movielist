$(function () {
    // Se define objeto de aplicación
    var MoviesDatabase = {};
    // variables para la conexión con la base de datos
    var dbMoviesDatabase;
    var dbName = "MoviesDatabase";
    var dbVersion = 1;
    var pgtransition = 'slide';
/// INI EJECUCIÓN de FUNCIÓN PRINCIPAL
    (function (app) {
        // Definición de variables
        var MovieLi = '<li><a data-id="Z2"><h2>Z1</h2><p>DESCRIPTION</p><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
        var MovieLiRi = '<li><a data-id="Z2">Z1</a></li>';
        var MovieHdr = '<li data-role="list-divider">Tus películas</li>';
        var noMovie = '<li id="noMovie">No tienes películas</li>';
        app.init = function () {
            // INI INICIALIZACIÓN DEL MODELO
            // Realizar la conexión con la base de datos
            var request = indexedDB.open(dbName, dbVersion);
            //verificar si es necesario una actualizacación debido a cambio de versión de la base de datos
            request.onupgradeneeded = function (e) {
                var thisDB = e.target.result;
                var store = null;
                // Generación de las tablas necesarias para la base de datos
                if (!thisDB.objectStoreNames.contains("Movie")) {
                    // Generación de la clave primaria (objeto almacenado) accesible a traves de MovieName
                    store = thisDB.createObjectStore("Movie", { keyPath: "MovieName" });
                }
            };
            // Conexión exitosa con la base de datos
            request.onsuccess = function (e) {
                dbMoviesDatabase = e.target.result;
            }
            // FIN INICIALIZACIÓN DEL MODELO

            // INI CONTROLADOR
            // Función encargada de la gestión de los eventos de usuario
            app.MovieBindings();
            // FIN CONTROLADOR

            /// INI Gestión de mensaje alerta
            $('#msgboxyes').on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                // Se almacena el metodo que se ha lanzado en la alerta
                var yesmethod = $('#msgboxyes').data('method');
                // Se almacena la respuesta del usuario
                var yesid = $('#msgboxyes').data('id');
                // Se trasladan estos valores a app 
                app[yesmethod](yesid);
            });
            $('#msgboxno').on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var nomethod = $('#msgboxno').data('method');
                var noid = $('#msgboxno').data('id');
                var toPage = $('#msgboxno').data('topage');
                // Redirecciona a la página anterior depues de realizar el borrado del registro
                $.mobile.changePage('#' + toPage, { transition: pgtransition });
                app[nomethod](noid);
            });
            $('#alertboxok').on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var toPage = $('#alertboxok').data('topage');
                // show the page to display after ok is clicked
                $.mobile.changePage('#' + toPage, { transition: pgtransition });
            });
            /// FIN Gestión de mensaje alerta
        };
/// FIN EJECUCIÓN de FUNCIÓN PRINCIPAL

//*****************************************************************

/// INI  CONTROL: Enlazar la Vista y la Capa de lógica : Gestión de eventos
        // Función que cumple dos funcionalidades:
        // 1: Antes de cargar la pantalla, analiza la ventara a mostrar al usuario y determina los datos a obtener de base de datos.
        // 2: A lo largo de la ejecución de la página se encarga de enlazar los eventos de usuario con los procedimientos de tratamiento de datos
        app.MovieBindings = function () {
            // 1: Ejecución antes de que se haya cargado la página, previo a mostrar la lista de elementos al usuario
            $(document).on('pagebeforechange', function (e, data) {
                // Obtenemos la página a la que nos dirigimos
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgMovieList':
                        $('#pgRptMovieBack').data('from', 'pgMovieList');
                        // Repite la consulta a base de datos para la obtención de elementos
                        app.checkForMovieStorage();
                        break;
                    case 'pgEditMovie':
                        $('#pgRptMovieBack').data('from', 'pgEditMovie');
                        $("#pgEditMovieMovieName").addClass("ui-state-disabled");
                        // Limpiar la página de contenido
                        pgEditMovieClear();
                        //  Cargar de los elementos del menú
                        var MovieName = $('#pgEditMovie').data('id');
                        // Lectura de los elementos desde la base de datos y refresco de la pantalla
                        app.editMovie(MovieName);
                        break;
                    case 'pgAddMovie':
                        $('#pgRptMovieBack').data('from', 'pgAddMovie');
                        pgAddMovieClear();
                        //  Cargar de los elementos del menú antes de que se haya mostrado la página
                        app.pgAddMoviecheckForMovieStorageR();
                        break;
                }
            });

            // 2: Ejecución una vez que se ha cargado la página
            // Establece los eventos para cada una de las páginas de la aplicación:
            // - Añadir elementos => ***** Add Page - Ini *****
            // - Mostrar elementos => ***** Listing Page *****
            // - Editar elementos => ***** Edit Page *****
          
            $(document).on('pagecontainershow', function (e, ui) {
                //***** Add Page - Ini *****
                /// Añadir una nueva película
                /// Eventos ejecutados desde la página donde se muestra el formulario de inserción de valores

                // INI NAV Vuelta atrás
                // Código ejecutado cuando el botón de vuelta atrás es ejecutado desde la página de añadir nuevo elemento
                // Vuelta atrás desde Añadir Película
                $('#pgAddMovieBack').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Volver a la pantalla de listado de elementos
                    $.mobile.changePage('#pgMovieList', { transition: pgtransition });
                
                });
                // FIN NAV Vuelta atrás
                // INI NAV Guardar
                // Código ejecutado cuando se pulsa el boton de guardar dede la pantalla de Añadir elmento
                $('#pgAddMovieSave').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Obtener los elementos del formulario y trasladarlos a un objeto
                    var MovieRec = pgAddMovieGetRec();
                    // Almacenar los objetos en la base de datos
                    app.addMovie(MovieRec);
                });
                // FIN NAV Guardar
                //***** Add Page - End *****

                //***** Listing Page *****
                /// Mostrar películas
                /// Listado de peliculas almacenados en la base de datos

                // Código ejecutado cuando se pulsa la visualización de elmentos
                // Evento click en listado de peliculas
                $(document).on('click', '#pgMovieList a', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Obtener el enlace pulsado desde la lista de elementos y formatearlo
                    var href = $(this).data('id');
                    href = href.split(' ').join('-');
                    // Almacenar el id del elemento para su edición 
                    $('#pgEditMovie').data('id', href);
                    // Navegar a la página de edición
                    $.mobile.changePage('#pgEditMovie', { transition: pgtransition });
                });
                // Código ejecutado cuando es pulsa sobre boton nuevo en el listado de elementos
                // Click en el botón Nuevo desde la pantalla de listado de elementos
                $('#pgMovieNew').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Accedemos a la pantalla de añadir un nuevo elemento desde el listado de películas
                    $('#pgAddMovie').data('from', 'pgMovie');
                    // Mostrar la pantalla activa y las opciones de usuario
                    $('#pgAddMovieheader h1').text('PeliBD > Añadir película');
                    $('#pgAddMovieMenu').show();
                    // Navegar a la pantalla de añadir un nuevo elemento
                    $.mobile.changePage('#pgAddMovie', { transition: pgtransition });
                });
                //***** Listing Page - End *****


                //***** Edit Page *****
                /// Pantalla de edición
                /// Pantalla accesible despues de seleccionar un elemento de la lista
                /// Modificamos los valores del elemento a partir del id

                // Código ejecutado cuando el boton de vuelta atrás es pulsado desde la pantalla de edición
                // Botón Vuelta atrás pulsado
                $('#pgEditMovieBack').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Volver atrás a la pantalla de mostrar los elementos
                    $.mobile.changePage('#pgMovieList', { transition: pgtransition });
                });
                // Código ejecutado cuando se pulsa el boton de Actualizar elemento
                // Boton de actualizar dede la pantalla de Edición
                $('#pgEditMovieUpdate').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    //get contents of Edit page controls
                    var MovieRec = pgEditMovieGetRec();
                    //save updated records to IndexedDB
                    app.updateMovie(MovieRec);
                });
                // Código ejectuado cuando se pulsa el boton de borrado desde la pantalla de edición
                // Click en botón de borrado
                $('#pgEditMovieDelete').on('click', function (e) {
                  //  e.preventDefault();
                  //  e.stopImmediatePropagation();
                    // Lectura del identificador del elemento seleccionado por el usuario
                    var MovieName = $('#pgEditMovieMovieName').val().trim();
                    // INI :: Mostrar mensaje de confirmación
                    $('#msgboxheader h1').text('Confirm Delete');
                    $('#msgboxtitle').text(MovieName.split('-').join(' '));
                    $('#msgboxyes').data('method', 'deleteMovie');
                    $('#msgboxno').data('method', 'editMovie');
                    $('#msgboxyes').data('id', MovieName.split(' ').join('-'));
                    $('#msgboxno').data('id', MovieName.split(' ').join('-'));
                    $('#msgboxyes').data('topage', 'pgEditMovie');
                    $('#msgboxno').data('topage', 'pgEditMovie');
                    $.mobile.changePage('#msgbox', { transition: 'pop', role: 'dialog' });
                    // FIN :: Mostrar mensaje de confirmación

                });

                // Boton de mostrar elementos
                // Click en bton de listado de los elementos almacecnados en la base de datos
                $(document).on('click', '#pgEditMovieRightPnlLV a', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Obtener el identificador del elemenetos a traves del enlace pulsado
                    var href = $(this).data('id');
                    href = href.split(' ').join('-');
                    // Lectura del elemento desde la base de datos y actualización de la pantalla
                    app.pgEditMovieeditMovie(href);
                });
                //***** Edit Page - End *****

            });
        }
/// FIN  CONTROL: Enlazar la Vista y la Capa de lógia : Gestión de eventos

//*****************************************************************
/// Una vez que los eventos estan definidos...
/// Se definen los metodos y procedimientos de acceso a los eventos

/// INI LÓGICA: Implementa la gestión del modelo de datos a partir de las accciones de usuario obtenidas desde el control


        // INI ALMACENAR NUEVO ELEMENTO DE IndexedDB
        // Proceso de almacenamiento de nuevos elementosAlmacenar la página de añadir elementos
        // Añadir un nuevo registro a la base de datos
        app.addMovie = function (MovieRec) {
            $.mobile.loading("show", {
                text: "Creating record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Limpiar el identificador almacenado con anterioridad
            var MovieName = MovieRec.MovieName;
            MovieName = MovieName.split(' ').join('-');
            MovieRec.MovieName = MovieName;
            // Guardar el objeto JSON en la base de datos
            // definir la transacción a ejecutar
            var tx = dbMoviesDatabase.transaction(["Movie"], "readwrite");
            // Obtener los objetos para añadir un nuevo elemento
            var store = tx.objectStore("Movie");
            // añadir al almacenamiento de anteriores elementos
            var request = store.add(MovieRec);
            request.onsuccess = function (e) {
                // En caso de exito en el almacecnamiento mostramoms un mensaje de notificación al usuario
                alert('Movie record successfully added.', 'Movies Database');
                // Obtener desde la página de la que hemos accedido, en caso de que sea desde la de acceso volvemos a ella
                var pgFrom = $('#pgAddMovie').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
                        // En caso de disponer de una pantalla de registro lo gestionaríamos desde aquí
                        // $.mobile.changePage('#pgSignIn', { transition: pgtransition });
                        break;
                    default:
                        // limpiamos los elemntos del formulario
                        pgAddMovieClear();
                        // Nos mantenemos en la misma página para seguir generando registros
                }
            }
            request.onerror = function (e) {
                // Mostramos un mensaje de notificación de error 
                alert('No se ha añadido la película.', 'PeliDB');
            }
            $.mobile.loading("hide");
        };
     
        // Funciones genéricas para añadir elementos:
        // - Borrado de la pantalla: Realiza el borrado de los elementos mostrados en el formulario al usuario
        // - Obtener valores de la pantalla: Realiza la lectura de los elementos introducidos en el formulario por el usuario
        function pgAddMovieClear() {
            $('#pgAddMovieMovieName').val('');
            $('#pgAddMovieMovieYear').val('');
            $('#pgAddMovieMovieGenre').val('');
        }
        // Obtiene el contenido y genera un objeto para su almacenamiento
        function pgAddMovieGetRec() {
            //define the new record
            var MovieRec = {};
            MovieRec.MovieName = $('#pgAddMovieMovieName').val().trim();
            MovieRec.MovieYear = $('#pgAddMovieMovieYear').val().trim();
            MovieRec.MovieGenre = $('#pgAddMovieMovieGenre').val().trim();
            return MovieRec;
        }
        // FIN ALMACENAR NUEVO ELMENTO DE IndexedDB
        // ********************************************************** 
        // INI ACTUALIZAR UN ELEMENTO DE IndexedDB
        // Proceso de actualización de los registros de base de datos definidos desde la pantalla de edición
        app.updateMovie = function (MovieRec) {
            // Mostrar mensaje de cargando durante la ejecución del proceso
            $.mobile.loading("show", {
                text: "Update record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Buscar una película específica 
            var MovieName = MovieRec.MovieName;
            // Formatear el identificador eliminando los espacios
            MovieName = MovieName.split(' ').join('-');
            MovieRec.MovieName = MovieName;
            // Definir la transacción a ejectura
            var tx = dbMoviesDatabase.transaction(["Movie"], "readwrite");
            // Obtener el objeto store de almacenar los elemntos
            var store = tx.objectStore("Movie");
            // Obtener los registros desde el objeto encargado de almacenarlos
            store.get(MovieName).onsuccess = function (e) {
                var request = store.put(MovieRec);
                request.onsuccess = function (e) {
                    // El registro a sido guardado
                    alert('Película actualizada.', 'PeliDB');
                    // Limpiamos los elementos del formulario
                    pgEditMovieClear();
                    // Mostrar la pantalla de listado de los elementos de base de datos
                    $.mobile.changePage('#pgMovieList', { transition: pgtransition });
                }
                request.onerror = function (e) {
                    alert('No se ha actualizado la película, intentelo otra vez.', 'PeliDB');
                    return;
                }
            };
            // Ocultamos el objeto de CARGANDO y mostramos el resultado
            $.mobile.loading("hide");
        };
        // Vacía los elementos de la pantalla de edición
        function pgEditMovieClear() {
            $('#pgEditMovieMovieName').val('');
            $('#pgEditMovieMovieYear').val('');
            $('#pgEditMovieMovieGenre').val('');
        }
        // Obtiene los valores introducidos por el usuario en la pantalla de edición y retorna un objeto para su almacenamiento
        function pgEditMovieGetRec() {
            //define the new record
            var MovieRec = {};
            MovieRec.MovieName = $('#pgEditMovieMovieName').val().trim();
            MovieRec.MovieYear = $('#pgEditMovieMovieYear').val().trim();
            MovieRec.MovieGenre = $('#pgEditMovieMovieGenre').val().trim();
            return MovieRec;
        }
        // Muestra el elemento seleccionado desde la pantalla de listado de elementos
        // Realiza la visualización en la pantalla de edición
        app.editMovie = function (MovieName) {
            $.mobile.loading("show", {
                text: "Lectura de registros...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Realizamos el vaciado de los valores introducidos por el usuario
            pgEditMovieClear();
            MovieName = MovieName.split(' ').join('-');
            var MovieRec = {};
            // Se relaiza una transacción para la lectura de los valores de base de datos
            var tx = dbMoviesDatabase.transaction(["Movie"], "readonly");
            // Se obtiene el objeto encargado de leer el almacenamiento
            var store = tx.objectStore("Movie");
            // Se realiza la busqueda del elemento a traves de su clave primaria
            var request = store.get(MovieName);
            request.onsuccess = function (e) {
                MovieRec = e.target.result;
                // En caso de que todo sea correcto preparmos la visualización
                // La clave primaria es de solo lectura
                $('#pgEditMovieMovieName').attr('readonly', 'readonly');
                // La clave primaria no puede ser borrada
                $('#pgEditMovieMovieName').attr('data-clear-btn', 'false');
                // Actualiza cada uno de los controles de la pantalla de edición
                // Damos formato a la clave primaria del registr, eliminando espacios en blanco y caracter -
                var pkey = MovieRec.MovieName;
                pkey = pkey.split('-').join(' ');
                MovieRec.MovieName = pkey;
                $('#pgEditMovieMovieName').val(MovieRec.MovieName);
                $('#pgEditMovieMovieYear').val(MovieRec.MovieYear);
                $('#pgEditMovieMovieGenre').val(MovieRec.MovieGenre);
            }
            // En caso de encontrar un error se lo notificamos al usuario
            request.onerror = function (e) {
                $('#alertboxheader h1').text('Error PeliDB');
                $('#alertboxtitle').text(MovieName.split('-').join(' '));
                $('#alertboxprompt').text('Se ha encontrado un error al realizar la lectura del valor, intentelo otra vez!');
                $('#alertboxok').data('topage', 'pgEditMovie');
                $('#alertboxok').data('id', MovieName.split(' ').join('-'));
                $.mobile.changePage('#alertbox', { transition: 'pop' });
                return;
            }
            $.mobile.loading("hide");
        };

        // Realizar la lectura de los registros de la base de datos y mostrarlos en la pantalla de edición
        app.pgEditMovieeditMovie = function (MovieName) {
            $.mobile.loading("show", {
                text: "Lectura de elementos...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Se vacian los elementos del formulario
            pgEditMovieClear();
            MovieName = MovieName.split(' ').join('-');
            var MovieRec = {};
            // Se define una transacción para realizar la lectura desde la base de datos
            var tx = dbMoviesDatabase.transaction(["Movie"], "readonly");
            // Obtenemos el objeto almacenador de la tabla Movie
            var store = tx.objectStore("Movie");
            // Obtenemos el registro a partir de su clave primaria
            var request = store.get(MovieName);
            request.onsuccess = function (e) {
                MovieRec = e.target.result;
                // En caso de que todo este correcto
                // Establecemos la clave primaria de solo lectura
                $('#pgEditMovieMovieName').attr('readonly', 'readonly');
                // Establecemos que la clave primaria no pueda ser borrada
                $('#pgEditMovieMovieName').attr('data-clear-btn', 'false');
                // Se actualizan cada uno de los controles de la ventana de edición
                // Se formatea y vacía la clave primaria
                var pkey = MovieRec.MovieName;
                pkey = pkey.split('-').join(' ');
                MovieRec.MovieName = pkey;
                $('#pgEditMovieMovieName').val(MovieRec.MovieName);
                $('#pgEditMovieMovieYear').val(MovieRec.MovieYear);
                $('#pgEditMovieMovieGenre').val(MovieRec.MovieGenre);
            }
            // Se ha encontrado un error
            request.onerror = function (e) {
                $('#alertboxheader h1').text('Movie Error');
                $('#alertboxtitle').text(MovieName.split('-').join(' '));
                $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
                $('#alertboxok').data('topage', 'pgEditMovie');
                $('#alertboxok').data('id', MovieName.split(' ').join('-'));
                $.mobile.changePage('#alertbox', { transition: 'pop' });
                return;
            }
            $.mobile.loading("hide");
        };
        // FIN ACTUALIZAR UN ELEMENTO DE IndexedDB
        // ********************************************************** 5
        /// INI BORRAR ELEMENTO DE BASE DE DATOS

        // Borrar un elemento partiendo de su identificador
        app.deleteMovie = function (MovieName) {
            $.mobile.loading("show", {
                text: "Borrando el registro...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            MovieName = MovieName.split(' ').join('-');
            // Definimos la transición a ejecutar
            var tx = dbMoviesDatabase.transaction(["Movie"], "readwrite");
            // Obtenemos el objeto almacenador de elementos de la tabla de base de datos
            var store = tx.objectStore("Movie");
            // Borramos el elemento a partir de su identificador
            var request = store.delete(MovieName);
            request.onsuccess = function (e) {
                // El registro ha sido eliminado de la base de datos
                alert('Película eliminada.', 'PeliDB');
                // Mostramos la página con los nuevos elementos
                $.mobile.changePage('#pgMovieList', { transition: pgtransition });
            }
            request.onerror = function (e) {
                alert('No se ha eliminado la película, intentelo otra vez.', 'PeliBD');
                return;
            }
            $.mobile.loading("hide");
        };
        /// FIN BORRAR ELEMENTO DE BASE DE DATOS
        // ********************************************************** 
        /// INI MOSTRAR ELEMENTOS REGISTRADOS EN LISTA DE ELEMENTOS
        // Muestra los registros a lo largo de la ejecución de la aplicación.
        app.displayMovie = function (MovieObj) {
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
                var MovieRec = MovieObj[n];
                // Vaciar la llave primiaria
                var pkey = MovieRec.MovieName;
                pkey = pkey.split('-').join(' ');
                MovieRec.MovieName = pkey;
                // Definir una nueva lína de la información obtenida
                var nItem = MovieLi;
                nItem = nItem.replace(/Z2/g, n);
                // Actualizar el  título, puede que sea multilínea
                var nTitle = '';
                // Asignar un título vacío
                nTitle = n.split('-').join(' ');
                // Reemplazar el título
                nItem = nItem.replace(/Z1/g, nTitle);
                // Contador númerico de la película
                var nCountBubble = '';
                nCountBubble += MovieRec.MovieYear;
                // reemplazar el contador de elemntos 
                nItem = nItem.replace(/COUNTBUBBLE/g, nCountBubble);
                // Actualizr la vista en cado de existir descripción
                var nDescription = '';
                nDescription += MovieRec.MovieGenre;
                // Reemplazar la descripción
                nItem = nItem.replace(/DESCRIPTION/g, nDescription);
                html += nItem;
            }
            // Actualizar la vista con la nueva estructura HTML geerada
            $('#listMovies').html(MovieHdr + html).listview('refresh');
            $.mobile.loading("hide");
        };
        
        
        app.pgAddMoviedisplayMovieR = function (MovieObj) {
            $.mobile.loading("show", {
                text: "Mostrando registros...",
                textVisible: true, 
                textonly: false, 
                html: ""
            });
            var html = '';
            var n;
            for (n in MovieObj) {
                var MovieRec = MovieObj[n];
                var pkey = MovieRec.MovieName;
                pkey = pkey.split('-').join(' ');
                MovieRec.MovieName = pkey;
                var nItem = MovieLiRi;
                nItem = nItem.replace(/Z2/g,n);
                var nTitle = '';
                nTitle = n.split('-').join(' ');
                nItem = nItem.replace(/Z1/g,nTitle);
                html += nItem;
            }
            
        };
        
        /// FIN MOSTRAR ELEMENTOS REGISTRADOS EN LISTA DE ELEMENTOS
        // ********************************************************** 
        /// INI VERIFICAR EL ALMACENAMIENTO DE LOS REGISTROS
        /// Inicializa la base de datos en caso de no haber registros
        // Muestra los elementos en caso de existir o notifica a usuario que no hay elementos
        app.checkForMovieStorage = function () {
            $.mobile.loading("show", {
                text: "Analizando base de datos...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // Obtener los registros de la base de datos IndexDB
            // cuando se retornan objetos estos se convierten en objetos JSON
            var MovieObj = {};
            // Se define una transacción para la lectura de elementos desde la base de datos
            var tx = dbMoviesDatabase.transaction(["Movie"], "readonly");
            // Obtener el objeto alamcenador de la tabla de base de datos
            var store = tx.objectStore("Movie");
            // Abrir un cursor para la lectura de todos los registros de base de datos
            var request = store.openCursor();
            request.onsuccess = function (e) {
                // Se devuleve el resultado
                var cursor = e.target.result;
                if (cursor) {
                    MovieObj[cursor.key] = cursor.value;
                    // Se procesa el siguiente registro
                    cursor.continue();
                }
                // Exten registros en la base de datos?
                if (!$.isEmptyObject(MovieObj)) {
                    // yes there are. pass them off to be displayed
                    app.displayMovie(MovieObj);
                } else {
                    // NO existes, mostramos el texto de ayuda
                    $('#listMovies').html(MovieHdr + noMovie).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // se ha encontrado un error
            request.onerror = function (e) {
                $.mobile.loading("hide");
                // mostrar solo el texto de ayuda
                $('#listMovies').html(MovieHdr + noMovie).listview('refresh');
            }
        };
        /// FIN VERIFICAR EL ALMACENAMIENTO DE LOS REGISTROS
        // ********************************************************** 9
        /// INI VERIFICAR EL ALMACENAMIENTO DE LOS REGISTROS despues de AÑADIR UN NUEVO ELEMENTO
        // Mostrar los registros en caso de existir, sino notificarselo al  usuario
        app.pgAddMoviecheckForMovieStorageR = function () {
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
            var tx = dbMoviesDatabase.transaction(["Movie"], "readonly");
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
                    app.pgAddMoviedisplayMovieR(MovieObj);
                } else {
                    // en caso de que no existan solo mostramos el texto de ayuda
                    $('#pgAddMovieRightPnlLV').html(MovieHdr + noMovie).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // en caso de encontrar un error
            request.onerror = function (e) {
                $.mobile.loading("hide");
                // solo se visualiza el texto de ayuda
                $('#pgAddMovieRightPnlLV').html(MovieHdr + noMovie).listview('refresh');
            }
        };
        // FIN VERIFICAR EL ALMACENAMIENTO DE LOS REGISTROS despues de AÑADIR UN NUEVO ELEMENTO
        // ********************************************************** 
 
      
/// FIN LÓGICA: Implementa la gestión del modelo de datos a partir de las accciones de usuario obtenidas desde el control
        app.init();
    })(MoviesDatabase);
});