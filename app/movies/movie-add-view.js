var MovieAddView = (function () {
    // Funciones genéricas para añadir elementos:
    return {
        // - Borrado de la pantalla: Realiza el borrado de los elementos mostrados en el formulario al usuario
        pgAddMovieClear: function (){
            $('#pgAddMovieMovieName').val('');
            $('#pgAddMovieMovieYear').val('');
            $('#pgAddMovieMovieGenre').val('');
        },
        // Obtiene el contenido y genera un objeto para su almacenamiento
        pgAddMovieGetRec: function (){
            // Definición del objeto retistro
            var movieRec = {};
            movieRec.movieName = $('#pgAddMovieMovieName').val().trim();
            movieRec.movieYear = $('#pgAddMovieMovieYear').val().trim();
            movieRec.movieGenre = $('#pgAddMovieMovieGenre').val().trim();
            return movieRec;
        }
  };

})();
