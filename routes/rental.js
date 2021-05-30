const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

const RECENT_MAX = 10;

const latestRentalQuery = 
`SELECT RentalNo, MemberNo, BranchNo, DateOut
FROM Rental
ORDER BY DateOut DESC
LIMIT ${RECENT_MAX}
;`;

const rentalVideoQuery = 
`SELECT Video.CatalogNo, VideoNo, Title, DateReturn
FROM Video_Rental
LEFT JOIN Video
ON Video.CatalogNo = Video_Rental.CatalogNo
WHERE RentalNo = ?
;`;

const rentalQuery = 
`SELECT RentalNo, MemberNo, BranchNo, DateOut
FROM Rental
WHERE DateOut >= ?
AND DateOut <= ?
ORDER BY DateOut DESC
;`;

const pendingRentalQuery =
`SELECT RentalNo, MemberNo, BranchNo, DateOut
FROM Rental
WHERE RentalNo IN (
    SELECT DISTINCT Rental.RentalNo
    FROM Rental
    LEFT JOIN Video_Rental
    ON Video_Rental.RentalNo = Rental.RentalNo
    WHERE CatalogNo IS NOT NULL
    AND DateReturn IS NULL
)
AND DateOut >= ?
AND DateOut <= ?
ORDER BY DateOut DESC
;`;

router.get("/", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        var [results,] = await connection.query(latestRentalQuery);
        for (rental of results) {
            rental.Videos = [];
            [rental.Videos,] = await connection.query(rentalVideoQuery, [rental.RentalNo]);
        }
        res.render("rental", {rentals: results});
        connection.release();
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/search", async(req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        try {
            var initalDate = req.query.afterdate.trim();
            var finalDate = req.query.beforedate.trim();
            
            if (initalDate == "") {
                initalDate = "1000-01-01";
            }
            if (finalDate == "") {
                finalDate = "9999-12-31";
            }
            
            var results = []
            if (req.query.pendingonly) {
                [results,] = await connection.query(pendingRentalQuery, [initalDate, finalDate]);
            }
            else {
                [results,] = await connection.query(rentalQuery, [initalDate, finalDate]);
            }

            for (rental of results) {
                rental.Videos = [];
                [rental.Videos,] = await connection.query(rentalVideoQuery, [rental.RentalNo]);
            }

            res.render("rental_results", {rentals: results});
        }
        catch(e){
            console.log(e);
            res.status(400).render("error_page", {message: e.message, backUrl: "/rental"});
        }
        finally {
            await connection.release();
        }
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
            res.render("submit_success", {type: "Rental", backUrl: "/rental"});
        }
        catch (e) {
            await connection.rollback();
            console.log(e);
            res.status(400).render("error_page", {message: e.message, backUrl: "/rental"});
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
            res.render("update_success", {type: "Rental", backUrl: "/rental"});
        }
        catch(e) {
            await connection.rollback();
            console.log(e);
            res.status(400).render("error_page", {message: e.message, backUrl: "/rental"});
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