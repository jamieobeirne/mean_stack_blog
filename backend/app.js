const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");


const app = express();

mongoose
  .connect(
    "mongodb://jamie:jsacSzVQ484rItHy@cluster0-shard-00-00.x4x2k.mongodb.net:27017,cluster0-shard-00-01.x4x2k.mongodb.net:27017,cluster0-shard-00-02.x4x2k.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ibq4fy-shard-0&authSource=admin&w=majority",
    { useNewUrlParser: true,
      useUnifiedTopology: true
     }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});



app.use("/api/posts", postsRoutes);

module.exports = app;
