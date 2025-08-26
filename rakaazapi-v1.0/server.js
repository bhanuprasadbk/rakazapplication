const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser'); 
//const sessions = require('express-session');
const cors = require('cors');
// var cron = require('node-cron');
// const jwt = require("jsonwebtoken");
// var methodOverride = require('method-override');
// var multer  =   require('multer');
// var fs = require("fs");
const app = express();
app.use(cors())
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));
app.use(cookieParser());
// creating 24 hours from milliseconds
// const oneDay = 1000 * 60 * 60 * 24;

// //session middleware
// app.use(sessions({
//     secret: "voilationmanagementsystemsessionkey",
//     saveUninitialized:true,
//     cookie: { maxAge: oneDay },
//     resave: false
// }));
app.use(express.json())
app.use(function (err,req, res, next) { //allow cross origin requests
 if (err.status == 400) {
    res.send(400,{
      message: "Bad Request"
   });
  }

 if (req.method === 'OPTIONS') {
   var headers = {};
   headers["Access-Control-Allow-Origin"] = "raqib.rak.ae:3002";
   headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
   headers["Access-Control-Allow-Credentials"] = false;
   headers["Access-Control-Max-Age"] = '86400'; // 24 hours
   headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,Origin";
   res.writeHead(200, headers);
   res.end();
  }
  res.setHeader("Access-Control-Allow-Origin", "localhost");
  res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Max-Age", "3600");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

app.use(bodyParser.json({ type: 'application/vnd.api+json',limit:'50mb' })); // parse application/vnd.api+json as json

require("./app/routers/login.router")(app);
require("./app/routers/cities.router")(app);
require("./app/routers/countries.router")(app);
require("./app/routers/customer-admin-type.router")(app);
require("./app/routers/customeradmin.router")(app);
require("./app/routers/customer.router")(app);
require("./app/routers/roles.router")(app);
require("./app/routers/states.router")(app);
require("./app/routers/users.router")(app);
require("./app/routers/units.router")(app);
require("./app/routers/customer-admin-type.router")(app);
require("./app/routers/currency.router")(app);
require("./app/routers/sensors.router")(app);
require("./app/routers/devices.router")(app);
require("./app/routers/reports.router")(app);

/*Customer Admin Router*/
require("./app/routers/customer-type.router")(app);
require("./app/routers/subscriptions.router")(app);
require("./app/routers/sensors-group.router")(app);
require("./app/routers/sensor-group-mapping.router")(app);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


