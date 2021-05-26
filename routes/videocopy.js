const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

const MAXQUERY = 1000;

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

router.get("/",async (req,res)=>{
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

module.exports = router;