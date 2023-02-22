const express = require('express')
const cors = require('cors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';

        //Middlewares (son funciones que añadiran otra funcionalidad al server)
        this.middlewares();
        //rutas de mi aplicacion 
        this.routes();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //LECTURA y PARSEO DEL BODY
        this.app.use( express.json() ); //----> OBTIENE INFORMACION DEL GET, POST Y SERIALIZARA A JSON

        //directorio publico
        this.app.use( express.static('public') );
    }

    routes() {

        this.app.use(this.usuariosPath,require('../routes/usuarios'));
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        });
    }


}


module.exports = Server;

