const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

router.get("/", async (req, res)=>{
    try {
        const [rows, fields] = await mysqlpool.query("SELECT * FROM Staff LIMIT 1000;");
        res.render("staff", {staff: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;