const express = require("express");
const mysql = require("mysql2");
const options = require("./config.json");

const port = options.port;

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});