const fs = require("fs");

const defaults = {
    port            : 3000,
    mysql_host      : "localhost",
    mysql_port      : 3306,
    mysql_database  : "test",
    mysql_user      : "user",
    mysql_password  : "p@ssword"
};

if (!fs.existsSync("./config.json")) {
    console.log("No config file found, loading defaults");
    fs.writeFileSync("./config.json", JSON.stringify(defaults, null, 4));
}
else {
    console.log("Config file found");
}