const mysql = require('mysql2');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'pharmazi',
    port:3307
  });


module.exports= connection;