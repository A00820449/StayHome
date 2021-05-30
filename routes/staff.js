const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

router.get("/", async (req, res)=>{
    try {
        var [rows, fields] = await mysqlpool.query("SELECT * FROM Staff LIMIT 1000;");
        for (staff of rows) {
            const query = new URLSearchParams({staffno: staff.StaffNo});
            staff.EditUrl = "/staff/edit?" + query.toString();
        }
        res.render("staff", {staff: rows});
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/edit", async (req, res)=>{
    try {
        var [rows,] = await mysqlpool.query("SELECT * FROM Staff WHERE StaffNo = ?;", [req.query.staffno]);
        res.render("staff_edit", {staff: rows[0]});
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;