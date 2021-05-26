const mysql = require("mysql2");
const options = require("./config.json");

const mysqloptions = {
    host    : options.mysql_host,
    port    : options.mysql_port,
    user    : options.mysql_user,
    password: options.mysql_password,
    database: options.mysql_database,

    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0
};

const mysqlpool = mysql.createPool(mysqloptions).promise();

module.exports = mysqlpool;