//import MovieModule from 'movies/movie-module';
//
// Enlazar la Vista y la Capa de lógica : Gestión de eventos
// Función que cumple dos funcionalidades:
// 1: Antes de cargar la pantalla, analiza la ventara a mostrar al usuario y determina los datos a obtener de base de datos.
// 2: A lo largo de la ejecución de la página se encarga de enlazar los eventos de usuario con los procedimientos de tratamiento de datos
var MovieBindings = class {
    
    constructor(){
        this.pgtransition = 'slide';
    }
    
    // 1: Ejecución antes de que se haya cargado la página, previo a mostrar la lista de elementos al usuario
    load(e, data) {
                // Obtenemos la página a la que nos dirigimos
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgMovieList':
                        $('#pgRptMovieBack').data('from', 'pgMovieList');
                        // Repite la consulta a base de datos para la obtención de elementos
                        MovieModule.getAll();
                        break;
                    case 'pgEditMovie':
                        $('#pgRptMovieBack').data('from', 'pgEditMovie');
                        $("#pgEditMovieMovieName").addClass("ui-state-disabled");
                        // Lectura de los elementos desde la base de datos y refresco de la pantalla
                        MovieModule.edit();
                        break;
                    case 'pgAddMovie':
                        $('#pgRptMovieBack').data('from', 'pgAddMovie');
                        //  Cargar de los elementos del menú antes de que se haya mostrado la página
                        MovieModule.add();
                        break;
                }
            }
    // 2: Ejecución una vez que se ha cargado la página
    // Establece los eventos para cada una de las páginas de la aplicación:
    // - Añadir elementos => ***** Add Page - Ini *****
    // - Mostrar elementos => ***** Listing Page *****
    // - Editar elementos => ***** Edit Page *****    
    show(e, ui){
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
                    $.mobile.changePage('#pgMovieList', { transition: this.pgtransition });
                
                });
                // FIN NAV Vuelta atrás
                // INI NAV Guardar
                // Código ejecutado cuando se pulsa el boton de guardar dede la pantalla de Añadir elmento
                $('#pgAddMovieSave').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Almacenar los objetos en la base de datos
                    MovieModule.save();
                     // Volver a la pantalla de listado de elementos
                    $.mobile.changePage('#pgMovieList', { transition: this.pgtransition });
                });
                // FIN NAV Guardar
                //***** Add Page - End *****

                //***** Listing Page *****
                /// Mostrar películas
                /// Listado de peliculas almacenados en la base de datos

                // Código ejecutado cuando se pulsa la visualización de elmentos
                // Evento click en listado de peliculas
                $(document).on('click', '#listMovies a', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // Obtener el enlace pulsado desde la lista de elementos y formatearlo
                    var href = $(this).data('id');
                    href = href.split(' ').join('-');
                    // Almacenar el id del elemento para su edición 
                    $('#pgEditMovie').data('id', href);
                    // Navegar a la página de edición
                    $.mobile.changePage('#pgEditMovie', { transition: this.pgtransition });
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
                    $.mobile.changePage('#pgAddMovie', { transition: this.pgtransition });
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
                    $.mobile.changePage('#pgMovieList', { transition: this.pgtransition });
                });
                // Código ejecutado cuando se pulsa el boton de Actualizar elemento
                // Boton de actualizar dede la pantalla de Edición
                $('#pgEditMovieUpdate').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    //save updated records to IndexedDB
                    MovieModule.update();
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
                    MovieModule.pgEditMovieeditMovie(href);
                });
                //***** Edit Page - End *****        
    }       
}
