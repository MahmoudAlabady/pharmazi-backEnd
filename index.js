const express =require('express');
const app = express();
const cors = require('cors');
const readXlsxFile = require('read-excel-file/node');
const multer = require('multer')
const path = require('path')
//use express static folder
app.use(express.static("./public"))
//////////
require("dotenv").config();
// get the client
const mysql = require('mysql2');


//middleware
app.use(cors());
app.use(express.json());
app.use('/puplic/uploads', express.static(__dirname + 'puplic/uploads'))


//connection
const connection = require('./db/mySQL');

// check database connection

connection.connect(err =>{
    if (err){console.log(err,'Error');}
    console.log('connected')
})

// console.log(res)
/////////////////////////////////////////////////////////
//Routes
const pharmaziRouts = require('./routes/pharmazi')

app.use(`/api/pharmazi`,pharmaziRouts)

////////////////////
const port = process.env.PORT;
const server = app.listen(port,()=>console.log(`server is running on ${port}`));
module.exports = server;