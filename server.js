const express = require("express");
const path = require("path");
const fs = require("fs"); 
const util = require("util");

//Asynchronous Processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Server
const app = express();
const PORT = process.env.PORT || 3000;

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//dir_name is the full directory name on our computer

//Middleware
app.use(express.static("./public"));

//API Route | "GET" request
app.get("/api/notes", function(req, res) {
  readFileAsync("./db/db.json", "utf8").then(function(data) {
      notes = [].concat(JSON.parse(data))
      res.json(notes);
    })
}); 

//API Route | "POST" request
app.post("/api/notes", function(req,res){
  const note = req.body;
  readFileAsync("./db/db.json", "utf8").then(function(data){
    const notes = [].concat(JSON.parse(data));
    note.id = notes.length + 1
    notes.push(note);
    return notes
  }).then(function(notes){
    writeFileAsync("./db/db.json", JSON.stringify(notes))
    res.json(note);
  })
});

//routes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
  });

app.get("/", function(req, res) {
     res.sendFile(path.join(__dirname, "./public/index.html"));
  });

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
 });

// Listening Port.  // Adding "0.0.0.0" fixed my port issue with Heroku
app.listen(PORT, "0.0.0.0", function() {
  console.log("App listening on PORT " + PORT);
});