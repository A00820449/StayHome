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

const videoSearchQuery_Actor = 
`SELECT CatalogNo, Title, Director.DirectorID, Name AS DirectorName, DailyRental, Cost
FROM Video
LEFT JOIN Director
ON Video.DirectorID = Director.DirectorID
WHERE CatalogNo IN (
    SELECT DISTINCT Video.CatalogNo
    FROM Video
    LEFT JOIN Actor_Video
    ON Video.CatalogNo = Actor_Video.CatalogNo
    LEFT JOIN Actor
    ON Actor_Video.ActorID = Actor.ActorID
    WHERE Actor.Name LIKE CONCAT('%',?,'%') ESCAPE '!'
);`;

const videoSearchQuery_Category =
`SELECT CatalogNo, Title, Director.DirectorID, Name AS DirectorName, DailyRental, Cost
FROM Video
LEFT JOIN Director
ON Video.DirectorID = Director.DirectorID
WHERE CatalogNo IN (
    SELECT DISTINCT Video.CatalogNo
    FROM Video
    LEFT JOIN Video_Category
    ON Video.CatalogNo = Video_Category.CatalogNo
    LEFT JOIN Category
    ON Video_Category.CategoryID = Category.CategoryID
    WHERE CategoryName LIKE CONCAT('%',?,'%') ESCAPE '!'
);`;

const videoSearchQuery_Director = 
`SELECT CatalogNo, Title, Director.DirectorID, Name AS DirectorName, DailyRental, Cost
FROM Video
LEFT JOIN Director
ON Video.DirectorID = Director.DirectorID
WHERE Name LIKE CONCAT('%',?,'%') ESCAPE '!'
;`;

const videoSearchQuery_Title = 
`SELECT CatalogNo, Title, Director.DirectorID, Name AS DirectorName, DailyRental, Cost
FROM Video
LEFT JOIN Director
ON Video.DirectorID = Director.DirectorID
WHERE Title LIKE CONCAT('%',?,'%') ESCAPE '!'
;`;

function EscapeForSQLLike(string) {
    return string.replace(/[!_%]/g, '!$&');
}

async function AddActorAndCategory(results, connection) {
    for (const result of results) {
        result.Actors = [];
        result.Categories = [];
        [result.Actors,] = await connection.query(videoActorQuery, [result.CatalogNo]);
        [result.Categories,] = await connection.query(videoCategoryQuery, [result.CatalogNo]);

        result.ActorNameList = result.Actors.map(actor => actor.Name).join(", ");
        result.CategoryNameList = result.Categories.map(category => category.CategoryName).join(", ");
    }
    return results;
}

router.get("/", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        var [results,] = await connection.query(videoQuery);

        results = await AddActorAndCategory(results, connection);
        connection.release();
        res.render("video", {videos: results});
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    } 
});

router.get("/search", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        try {
            const mode = req.query.searchoption.trim().toLowerCase();
            const searchtermunescaped = req.query.searchtext.trim().toLowerCase();
            searchterm = EscapeForSQLLike(searchtermunescaped);
            let queryString;
            if (mode === "title") {
                queryString = videoSearchQuery_Title;
            }
            else if (mode === "category") {
                queryString = videoSearchQuery_Category;
            }
            else if (mode === "actor") {
                queryString = videoSearchQuery_Actor;
            }
            else if (mode === "director") {
                queryString = videoSearchQuery_Director;
            }
            else {
                throw new Error("Search mode invalid");
            }
            var [results,] = await connection.query(queryString, [searchterm]);
            results = await AddActorAndCategory(results, connection);
            res.render("video_results", {videos: results, searchterm: searchtermunescaped});
        }
        catch(e) {
            console.log(e);
            res.status(400).render("error_page", {message: e.message, backUrl: "/video"});;
        }
        finally {
            connection.release();
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;