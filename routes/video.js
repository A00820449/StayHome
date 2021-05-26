const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

const MAXQUERY = 1000;

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

router.get("/", async (req, res)=>{
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
});

module.exports = router;