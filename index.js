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

app.use("/rental", rental);
app.use("/video", video);

/*const videoQuery =
`SELECT Video.CatalogNo, Title, DailyRental, Cost, Director.DirectorID, Director.Name AS DirectorName, Actor.ActorID, Actor.Name AS ActorName
FROM Actor_Video
LEFT JOIN Video
ON Video.CatalogNo = Actor_Video.CatalogNo
LEFT JOIN Actor
ON Actor.ActorID = Actor_Video.ActorID
LEFT JOIN Director
ON Director.DirectorID = Video.DirectorID
LIMIT ${MAXQUERY};`

function VideoGroupActor(videos) {
    const output = videos.reduce((acum, curr)=>{
        if (!acum[curr.CatalogNo]) {
            acum[curr.CatalogNo] = {
                CatalogNo: curr.CatalogNo,
                Title: curr.Title,
                DailyRental: curr.DailyRental,
                Cost: curr.Cost,
                DirectorID: curr.DirectorID,
                DirectorName: curr.DirectorName,
                Actors: []
            }
        }

        const actor = {
            ActorID: curr.ActorID,
            Name: curr.ActorName
        }

        acum[curr.CatalogNo].Actors.push(actor);
        return acum;
    },{});
    return Object.values(output);
}

app.get("/video", async (req, res)=>{
    try {
        var [results,] = await mysqlpool.query(videoQuery);
        results = VideoGroupActor(results);
        results.forEach(result => {
            result.ActorNameList = [];
            result.ActorNameList = result.Actors.map(actor => actor.Name);
            result.ActorNameList = result.ActorNameList.join(", ");
        });
        res.render("video", {videos: results});
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    } 
});*/

const videoCopyQuery =
`SELECT VideoCopy.CatalogNo, VideoCopy.VideoNo, BranchNo, Title, (RentalNo IS NOT NULL AND DateReturn IS NULL) AS CurrentlyRented
FROM VideoCopy 
LEFT JOIN (
    SELECT * 
    FROM Video_Rental 
    WHERE DateReturn IS NULL
    ) AS Rented
ON Rented.CatalogNo = VideoCopy.CatalogNo AND Rented.VideoNo = VideoCopy.VideoNo
LEFT JOIN Video
ON Video.CatalogNo = VideoCopy.CatalogNo
ORDER BY CatalogNo ASC
LIMIT ${MAXQUERY};`
;

app.get("/videocopy",async (req,res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        const [rows,] = await connection.query(videoCopyQuery);
        res.render("videocopy",{videocopies: rows});
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.all("*", (req, res)=>{
    res.sendStatus(404);
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});