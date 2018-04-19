//Pruerto
process.env.PORT = process.env.PORT || 3000;


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//base datos

let urlDB;

//EL MONGO_URI lo cree como variable de entonrno con heroku
//para crearlo es con 
//heroku config:set MONGO_URI="URL"
//para buscarlo HEROKU CONFIG:GET MONGO_URI
//para borrarlo HEROKU CONFIG:UNSET MONGO_URI
//DESPUES DE HABERLA CREADO, SE PUEDE USAR, ESTO ES PARA QUE NO QUEDE EXPUESTA EN GITHUB, Y LA RECONOSCA HEROKU
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;