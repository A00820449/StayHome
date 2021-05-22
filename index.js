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

const rentalQuery = 
`SELECT Rental.RentalNo, Rental.MemberNo, Video_Rental.CatalogNo, Video_Rental.VideoNo, Video.Title , DateOut, DateReturn
FROM Video_Rental
LEFT JOIN Rental
ON Video_Rental.RentalNo = Rental.RentalNo
LEFT JOIN Video
ON Video.CatalogNo = Video_Rental.CatalogNo
ORDER BY Rental.RentalNo
LIMIT ${MAXQUERY};`
;

function GroupRentals(rentals){
    const output = rentals.reduce((acum, curr)=>{
        // Initiate object if it's the first encounter
        if (!acum[curr.RentalNo]) {
            acum[curr.RentalNo] = {
                RentalNo: curr.RentalNo,
                MemberNo: curr.MemberNo,
                Videos: []
            };
        }
        
        const vid = {
            CatalogNo: curr.CatalogNo,
            VideoNo: curr.VideoNo,
            Title: curr.Title,
            DateOut: curr.DateOut,
            DateReturn: curr.DateReturn
        };

        acum[curr.RentalNo].Videos.push(vid);
        
        return acum;
    },{});

    return Object.values(output);
};

app.get("/rental", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        var [results,] = await connection.query(rentalQuery);
        results = GroupRentals(results);
        res.render("rental", {rentals: results});
    }
    catch(e) {
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