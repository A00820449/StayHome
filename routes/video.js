const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

const PAGE_LIMIT = 100;
const ACTOR_LIMIT = 10;
const CATEGORY_LIMIT = 10;

const videoQuery =
`SELECT CatalogNo, Title, DailyRental, Cost, Name AS DirectorName
FROM Video
LEFT JOIN Director
ON Video.DirectorID = Director.DirectorID
ORDER BY CatalogNo ASC
LIMIT ${PAGE_LIMIT}
;`;

const videoActorQuery =
`SELECT Actor.ActorID, Name
FROM Actor_Video
LEFT JOIN Actor
ON Actor_Video.ActorID = Actor.ActorID
WHERE CatalogNo = ?
LIMIT ${ACTOR_LIMIT}
;`;

const videoCategoryQuery = 
`SELECT Category.CategoryID, CategoryName
FROM Video_Category
LEFT JOIN Category
ON Video_Category.CategoryID = Category.CategoryID
WHERE CatalogNo = ?
LIMIT ${CATEGORY_LIMIT}
;`;

router.get("/", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        var [results,] = await connection.query(videoQuery);
        for (const video of results) {
            video.Actors = [];
            video.Categories = [];
            [video.Actors,] = await connection.query(videoActorQuery, [video.CatalogNo]);
            [video.Categories,] = await connection.query(videoCategoryQuery, [video.CatalogNo]);

            video.ActorNameList = video.Actors.map(actor => actor.Name).join(", ");
            video.CategoryNameList = video.Categories.map(category => category.CategoryName).join(", ");
        }
        connection.release();
        res.render("video", {videos: results});
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    } 
});

module.exports = router;