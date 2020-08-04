var DeleteModule = (function () {
    //
    deleteMovie = function(MovieName) {
            $.mobile.loading("show", {
                text: "Borrando el registro...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            MovieName = MovieName.split(' ').join('-');
            // Definimos la transición a ejecutar
            var tx = PersistenceManager.get().transaction(["Movie"], "readwrite");
            // Obtenemos el objeto almacenador de elementos de la tabla de base de datos
            var store = tx.objectStore("Movie");
            // Borramos el elemento a partir de su identificador
            var request = store.delete(MovieName);
            request.onsuccess = function (e) {
                // El registro ha sido eliminado de la base de datos
                alert('Película eliminada.', 'PeliDB');
                // Mostramos la página con los nuevos elementos
                $.mobile.changePage('#pgMovieList', { transition: 'slide' });
            }
            request.onerror = function (e) {
                alert('No se ha eliminado la película, intentelo otra vez.', 'PeliBD');
                return;
            }
            $.mobile.loading("hide");
        };
    /// FIN BORRAR ELEMENTO DE BASE DE DATOS
    return {
        delete: deleteMovie
    };
}());