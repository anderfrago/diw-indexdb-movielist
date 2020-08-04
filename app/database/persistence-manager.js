  // Se define objeto de aplicación
var MoviesDatabase = {};
// variables para la conexión con la base de datos
var dbMoviesDatabase;
var PersistenceManager =  ( function() {

    var initialize=function(){
        this.dbName = "MoviesDatabase";
        this.dbVersion = 1;

        
        // INI INICIALIZACIÓN DEL MODELO
        // Realizar la conexión con la base de datos
        var request = indexedDB.open(this.dbName, this.dbVersion);
        //verificar si es necesario una actualizacación debido a cambio de versión de la base de datos
        request.onupgradeneeded = async function (e) {
            var thisDB = e.target.result;
            var store = null;
            // Generación de las tablas necesarias para la base de datos
            if (!thisDB.objectStoreNames.contains("Movie")) {
                // Generación de la clave primaria (objeto almacenado) accesible a traves de MovieName
                store = thisDB.createObjectStore("Movie", { keyPath: "movieName" });
            }
        };
        // Conexión exitosa con la base de datos
        request.onsuccess = function (e) {
            dbMoviesDatabase = e.target.result;
        }
        // FIN INICIALIZACIÓN DEL MODELO
    }


    // Acceso a los elementos de la clase
    var  getMoviesDatabase = function() {
         return dbMoviesDatabase;
    }
  
    return {
        get: getMoviesDatabase,
        connect: initialize
    };
}());