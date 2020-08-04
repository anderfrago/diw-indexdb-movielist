var MovieView = (function () {
  
  return {
    getMovieLi: function () {
      return '<li><a data-id="Z2"><h2>Z1</h2><p>DESCRIPTION</p><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
    },
    getMovieLiRi: function () {
      return '<li><a data-id="Z2">Z1</a></li>';
    },
    getMovieHdr: function () {
      return '<li data-role="list-divider">Tus películas</li>';
    },
    getnoMovie: function () {
      return '<li id="noMovie">No tienes películas</li>';
    }
  };

})();

