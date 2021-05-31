const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

router.get("/", async (req, res)=>{
    try {
        const files = fs.readdirSync(path.join(__dirname,"../public/sql-queries"));
        res.render("team-queries",{files});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/run", async (req, res)=> {
    try {
        const filename = req.query.filename;
        const filepath = path.join(__dirname,"../public/sql-queries/", filename);
        const filecontent = fs.readFileSync(filepath, "utf8");
        try {
            var [rows,] = await mysqlpool.query(filecontent);
            res.render("query_results", {results: rows, query: filecontent});
        }
        catch(e) {
            res.status(500).render("error_page", {message: filecontent + "\nError:\n" + e.message, backUrl: "/team-queries"});
        }
    }
    catch(e) {
        console.log(e);
        res.status(500).render("error_page", {message: e.message, backUrl: "/team-queries"});
    }
});

router.get("/file", async (req, res)=> {
    try {
        const filename = req.query.filename;
        const filepath = path.join(__dirname,"../public/sql-queries/", filename);
        const filecontent = fs.readFileSync(filepath, "utf8");
        res.contentType("text/plain").send(filecontent);
    }
    catch(e) {
        console.log(e);
        res.status(500).render("error_page", {message: e.message, backUrl: "/team-queries"});
    }
});


module.exports = router;