const path = require("path");
const express = require("express");
const mysql = require("mysql2");
const options = require("./config.json");


const rental = require("./routes/rental");
const video = require("./routes/video");
const videocopy = require("./routes/videocopy");
const branch = require("./routes/branch");
const staff = require("./routes/staff");
const member = require("./routes/member");


const port = options.port;

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    res.render("index");
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use("/branch", branch);
app.use("/staff", staff);
app.use("/member", member);
app.use("/rental", rental);
app.use("/video", video);
app.use("/videocopy", videocopy);

app.all("*", (req, res)=>{
    res.sendStatus(404);
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});