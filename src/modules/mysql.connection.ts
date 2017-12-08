var mysql = require('mysql');
import { config } from '../config';

export class MySQLConnection {
    static conn: any;
    
    static handleDBError() {
        this.conn = mysql.createConnection(config.mysqlCred);

        this.conn.connect(function(err){
            if (err) {
                console.log('Error connecting to MySQL database:', err);
                setTimeout(() => this.handleDBError(), 2000);
            }
        });
        
        this.conn.on('error', function(err){
            console.log('MySQL database error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST'){
                this.handleDBError();
            } else {
                throw err;
            }
        });
    }
}

MySQLConnection.handleDBError()