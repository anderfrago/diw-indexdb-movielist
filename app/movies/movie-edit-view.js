var MovieEditView = (function () {
    // Funciones genéricas para añadir elementos:
    return {
       // Vacía los elementos de la pantalla de edición
        pgEditMovieClear: function() {
            $('#pgEditMovieMovieName').val('');
            $('#pgEditMovieMovieYear').val('');
            $('#pgEditMovieMovieGenre').val('');
        },
        // Obtiene los valores introducidos por el usuario en la pantalla de edición y retorna un objeto para su almacenamiento
        pgEditMovieGetRec: function() {
            //define the new record
            var MovieRec = {};
            MovieRec.movieName = $('#pgEditMovieMovieName').val().trim();
            MovieRec.movieYear = $('#pgEditMovieMovieYear').val().trim();
            MovieRec.movieGenre = $('#pgEditMovieMovieGenre').val().trim();
            return MovieRec;
        }
  };

})();

