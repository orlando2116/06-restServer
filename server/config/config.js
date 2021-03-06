//Pruerto
process.env.PORT = process.env.PORT || 3000;


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//vencimiento token
process.env.CADUCIDAD_TOKEN = '48h';

//seed token
process.env.SEED = process.env.SEED || 'secret';



//base datos

let urlDB;

//EL MONGO_URI lo cree como variable de entonrno con heroku
//para crearlo es con 
//heroku config:set MONGO_URI="URL"
//para buscarlo HEROKU CONFIG:GET MONGO_URI
//para borrarlo HEROKU CONFIG:UNSET MONGO_URI
//DESPUES DE HABERLA CREADO, SE PUEDE USAR, ESTO ES PARA QUE NO QUEDE EXPUESTA EN GITHUB, Y LA RECONOSCA HEROKU
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/gestion';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '105776915070-5h2p86nh69g5jeanjimghd1udittdgn1.apps.googleusercontent.com';