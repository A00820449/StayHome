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

const rentalQuery = 
`SELECT Rental.RentalNo, Rental.MemberNo, Rental.BranchNo, Video_Rental.CatalogNo, Video_Rental.VideoNo, Video.Title , DateOut, DateReturn
FROM Video_Rental
LEFT JOIN Rental
ON Video_Rental.RentalNo = Rental.RentalNo
LEFT JOIN Video
ON Video.CatalogNo = Video_Rental.CatalogNo
ORDER BY Rental.RentalNo
LIMIT ${MAXQUERY};`
;

const currRentedCheckQuery = 
`SELECT COUNT(*) AS CurrentlyRented
FROM Video_Rental
WHERE DateReturn IS NULL
AND CatalogNo = ?
AND VideoNo = ?
FOR UPDATE;`
;

function RentalGroupVideo(rentals){
    const output = rentals.reduce((acum, curr)=>{
        // Initiate object if it's the first encounter
        if (!acum[curr.RentalNo]) {
            acum[curr.RentalNo] = {
                RentalNo: curr.RentalNo,
                MemberNo: curr.MemberNo,
                BranchNo: curr.BranchNo,
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
        results = RentalGroupVideo(results);
        res.render("rental", {rentals: results});
        connection.release();
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

const MAX_MOVIES_PER_RENTAL = 10;

app.post("/rental/submit", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        await connection.beginTransaction();
        try {
            const memberNo = req.body["memberno"].trim();
            const branchNo = req.body["branchno"].trim();
            var dateOut = new Date;
            dateOut = dateOut.toISOString().split("T")[0];
            await connection.execute("INSERT INTO Rental (MemberNo, BranchNo, DateOut) Values (?,?,?)", [memberNo, branchNo, dateOut]);
            const [rentalnorow,] = await connection.query("SELECT LAST_INSERT_ID() AS RentalNo;");
            const rentalNo = rentalnorow[0].RentalNo;
            var videoList = [];
            for (var i = 1; i <= MAX_MOVIES_PER_RENTAL; i++) {
                const currCatalogNo = req.body["catalogno" + i.toString()].trim();
                const currVideoNo = req.body["videono" + i.toString()].trim();
                if (currCatalogNo != "" || currVideoNo != "") {

                    const [currentlyrentcheckrows,] = await connection.query("SELECT COUNT(*) AS CurrentlyRented FROM Video_Rental WHERE DateReturn IS NULL AND CatalogNo = ? AND VideoNo = ?;", [currCatalogNo, currVideoNo]);
                    if (currentlyrentcheckrows[0].CurrentlyRented > 0) {
                        console.log("Rented Error");
                        throw new Error(`Video with Catalog No: ${currCatalogNo} and Video No: ${currVideoNo} is not available.`);
                    }
                    videoList.push({CatalogNo: currCatalogNo, VideoNo: currVideoNo});
                }
            }
            if (videoList.length < 1) {
                console.log("No video Error");
                throw new Error("Need at least one valid video");
            }
            for (const video of videoList) {
                await connection.execute("INSERT INTO Video_Rental (RentalNo, CatalogNo, VideoNo) Values (?,?,?);",[rentalNo, video.CatalogNo, video.VideoNo]);
            }
            await connection.commit();
            res.send("Rental succesfully saved");
        }
        catch (e) {
            await connection.rollback();
            console.log(e);
            res.status(400).send(e.message);
        }
        finally {
            await connection.release();
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.post("/return/submit", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        await connection.beginTransaction();
        try {
            const catalogNo = req.body.catalogno.trim();
            const videoNo = req.body.videono.trim();
            var date = new Date();
            date = date.toISOString().split("T")[0];
            
            const [rows,] = await connection.query("UPDATE Video_Rental SET DateReturn := ? WHERE DateReturn IS NULL AND CatalogNo = ? AND VideoNo = ?;",[date, catalogNo, videoNo]);

            if (rows.changedRows < 1) {
                throw new Error("No records were changed");
            }
            
            await connection.commit();
            res.send("Record updated");
        }
        catch(e) {
            await connection.rollback();
            console.log(e);
            res.status(400).send(e.message);
        }
        finally {
            await connection.release();
        }
    }
    catch (e){
        console.log(e);
        res.sendStatus(500);
    }
});

const videoQuery =
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
        console.log(results);
        res.render("video", {videos: results});
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    } 
});

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