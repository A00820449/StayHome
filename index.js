const path = require("path");
const express = require("express");
const mysql = require("mysql2");
const options = require("./config.json");

const port = options.port;
const MAXQUERY = 1000;

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
const mysqlpool = mysql.createPool(mysqloptions).promise();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/branch", async (req, res)=>{
    try {
        const [rows, fields] = await mysqlpool.query(`SELECT * FROM Branch LIMIT ${MAXQUERY};`);
        res.render("branch", {branches: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get("/staff", async (req, res)=>{
    try {
        const [rows, fields] = await mysqlpool.query("SELECT * FROM Staff LIMIT 1000;");
        res.render("staff", {staff: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get("/member", async (req, res)=>{
    try {
        const [rows, fields] = await mysqlpool.query("SELECT * FROM Member LIMIT 1000;");
        res.render("member", {members: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

const rental = require("./routes/rental");
const video = require("./routes/video");
const videocopy = require("./routes/videocopy");

app.use("/rental", rental);
app.use("/video", video);
app.use("/videocopy", videocopy);

app.all("*", (req, res)=>{
    res.sendStatus(404);
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});