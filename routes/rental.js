const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

const MAXQUERY = 1000;

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

router.get("/", async (req, res)=>{
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

router.post("/submit", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        await connection.beginTransaction();
        try {
            const memberNo = req.body["memberno"].trim();
            const branchNo = req.body["branchno"].trim();

            await connection.query("INSERT INTO Rental (MemberNo, BranchNo, DateOut) Values (?,?,CURDATE())", [memberNo, branchNo]);
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
                await connection.query("INSERT INTO Video_Rental (RentalNo, CatalogNo, VideoNo) Values (?,?,?);",[rentalNo, video.CatalogNo, video.VideoNo]);
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

router.post("/return", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        await connection.beginTransaction();
        try {
            const catalogNo = req.body.catalogno.trim();
            const videoNo = req.body.videono.trim();
            
            const [rows,] = await connection.query("UPDATE Video_Rental SET DateReturn := CURDATE() WHERE DateReturn IS NULL AND CatalogNo = ? AND VideoNo = ?;",[catalogNo, videoNo]);

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

module.exports = router;