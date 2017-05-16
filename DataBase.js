/**
 * Created by May on 15/05/2017.
 */

var util = require('util');
var path = require('path');
var fs = require('fs');
const sql = require('mssql');

var config = {
    server: "193.106.55.27",
    user: "cookit",
    password: "cs@4077",
    database: "CookIt"
};

// constructor
var DataBase = function Constructor()
{
}


/*
const pool = new MsSql.ConnectionPool({
    user: 'project27',
    password: 'cs@4077',
    server: '193.106.55.27',
    database: 'CookIt'
})
*/

DataBase.prototype.executeQuery = function (query)
{
    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query(query, function (err, recordset) {

            if (err) console.log(err)

            console.log(recordset.recordset );
            // closes the connection
            sql.close();

            // send records as a response
            return recordset;

        });
    });
}

/*
pool.connect();
/*
(err => {
    // ...
    //console.log(err);
})


const request = new MsSql.Request(pool);
request.query('select * from tbl_FoodGroups', (err, result) => {
    // ... error checks

    console.log(result.recordset[0]) // return 1

// ...
});
*/

// export our class to outside access
module.exports = DataBase;