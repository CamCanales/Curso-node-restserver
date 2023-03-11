const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //CONECTAR A BASE DE DATOS (MONGO)
        this.conectarDB();

        //Middlewares (son funciones que añadiran otra funcionalidad al server)
        this.middlewares();
        //rutas de mi aplicacion 
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    //----> MIDDLEWARE ES UNA FUNCION QUE SE LLAMA ANTES DE UN CONTROLADOR O ANTES DE CONTINUAR CON LA PETICION DE EJECUCIONES
    middlewares(){

        //CORS
        this.app.use(cors());

        //LECTURA y PARSEO DEL BODY
        this.app.use( express.json() ); //----> OBTIENE INFORMACION DEL GET, POST Y SERIALIZARA A JSON

        //directorio publico
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.authPath,require('../routes/auth'));
        this.app.use(this.usuariosPath,require('../routes/usuarios'));              
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        });
    }


}


module.exports = Server;

