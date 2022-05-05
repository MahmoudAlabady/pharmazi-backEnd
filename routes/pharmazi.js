const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const readXlsxFile = require('read-excel-file/node');
const connection = require('../db/mySQL');



router.put('/updateDiscount', (req, res) =>{
    let result=connection.query(
        `UPDATE seller_products
    INNER JOIN updatee ON updateee.Seller_id = seller_products.seller_id   
    SET seller_products.discount = updatee.Discount
    WHERE seller_products.product_id = updatee.PHRItemID`,
        function(err, results, fields) {
            
          console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        }
      );
      res.status(200).send('done');
    });

  ////////////////////////////////////////////////////////////////
  // Multer Upload Storage
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, 'public/uploads')
},
filename: (req, file, cb) => {
cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
}
});
const upload = multer({storage: storage});
/////////////////////////
//! Routes start
//route for Home page
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    });

////////////////////////
// -> Express Upload RestAPIs
router.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
    importExcelData2MySQL( 'public/uploads/' + req.file.filename);
    console.log(res);
    res.status(200).send('sucess')
    });

//////////////////////////////////////////////    
// -> Import Excel Data to MySQL database
 function importExcelData2MySQL(filePath){
    // File path.
    // connection.connect(function(err) {
    //   if (err) throw err;
    //   console.log("Connected!");
    //   var sql = "CREATE TABLE customers (Discount DOUBLE(255), StoreItemID BIGINT(255), PHRItemID BIGINT(255), Seller_id BIGINT(255))";

    //   // var sql = "CREATE TABLE updateee (Discount double(20), StoreItemID bigint(20), PHRItemID bigint(20), Seller_id bigint(20))";
    //   connection.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Table created");
    //   });
    // });
    readXlsxFile(filePath).then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.     
    console.log(rows);
    /**
    [ [ 'Id', 'Name', 'Address', 'Age' ],
    [ 1, 'john Smith', 'London', 25 ],
    [ 2, 'Ahman Johnson', 'New York', 26 ]
    */
    // Remove Header ROW
    rows.shift();
    // Open the MySQL connection
    connection.connect((error) => {
    if (error) {
    console.error(error);
    } else {
    let query = 'INSERT INTO `updateee` (Discount, StoreItemID, PHRItemID, Seller_id) VALUES ?';
    // let query = 'INSERT INTO update (Discount, StoreItemID, PHRItemID, Seller_id) VALUES ?';

    connection.query(query, [rows], (error, response) => {
    console.log(error || response);
    /**
    OkPacket {
    fieldCount: 0,
    affectedRows: 5,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '&Records: 5  Duplicates: 0  Warnings: 0',
    protocol41: true,
    changedRows: 0 } 
    */
    });
    }
    });
    })
    }

    module.exports = router