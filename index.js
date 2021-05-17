const express = require("express");
const mysql = require("mysql2");
const options = require("./config.json");

const port = options.port;

const app = express();
app.set("view engine", "ejs");

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
const dbPool = mysql.createPool(mysqloptions).promise();

app.get("/", async (req, res) => {
    try {
        const [rows, fields] = await dbPool.query("SELECT * FROM Branch;");
        res.render("index", {results: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get("*", (req, res)=>{
    res.sendStatus(404);
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});