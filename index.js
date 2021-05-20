const path = require("path");
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
const dbConnection = mysql.createPool(mysqloptions).promise();

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/branch", async (req, res)=>{
    try {
        const [rows, fields] = await dbConnection.query("SELECT * FROM Branch LIMIT 1000;");
        res.render("branch", {branches: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get("/staff", async (req, res)=>{
    try {
        const [rows, fields] = await dbConnection.query("SELECT * FROM Staff LIMIT 1000;");
        res.render("staff", {staff: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get("/member", async (req, res)=>{
    try {
        const [rows, fields] = await dbConnection.query("SELECT * FROM Member LIMIT 1000;");
        res.render("member", {members: rows});
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