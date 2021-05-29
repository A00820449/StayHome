const express = require("express");
const router = express.Router();
const mysqlpool = require("../db_connection_pool");

async function BranchAddStaff(branches, connection) {
    for (var branch of branches) {
        branch.Staff = [];
        [branch.Staff,] = await connection.query(`SELECT * FROM Staff WHERE BranchNo = ?;`, [branch.BranchNo]);
    }
    return branches;
}

router.get("/", async (req, res)=>{
    try {
        const connection = await mysqlpool.getConnection();
        try {
            var [rows, fields] = await connection.query(`SELECT * FROM Branch LIMIT 1000;`);
            rows = await BranchAddStaff(rows, connection);
            res.render("branch", {branches: rows});
        }
        catch (e) {
            throw e;
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