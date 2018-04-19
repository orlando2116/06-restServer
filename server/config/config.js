//Pruerto
process.env.PORT = process.env.PORT || 3000;


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//base datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:123456@ds251799.mlab.com:51799/cafe';
}

process.env.URLDB = urlDB;