//Dependencies
const path = require("path")
const express = require("express");
const fs = require("fs");

//=============================================================================

//Path
const db = path.join(__dirname, "/db")
const mainPath = path.join(__dirname, "/public")

// ==============================================================================

// Setting the express server
const app = express();
//===============================================================================
// Adding the port 
const PORT = process.env.PORT || 8000;

//==============================================================================

// Handling parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))


// ================================================================================
// OUR ROUTES

// HTML GET Requests:
app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainPath, "notes.html"));
});



//API GET Requests:
app.get("/api/notes", function(req, res) {
    //google return json files using app.get
    res.sendFile(path.join(db, "db.json"))
    return res.body

})
app.get("*", function(req, res) {
    res.sendFile(path.join(mainPath, "index.html"));
});

//API POST Requests:
app.post("/api/notes", function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    var newNote = req.body;


    var uniqueId = (savedNotes.length).toString();
    newNote.id = uniqueId;
    savedNotes.push(newNote);


    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));

    res.json(savedNotes);

})


//API DELETE Requests: 
app.delete("/api/notes/:id", function(req, res) {

    //read data
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    var noteID = req.params.id;
    var newID = 0;

    savedNotes = savedNotes.filter(currentNote => {

        return currentNote.id != noteID;

    })

    for (currentNote of savedNotes) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    return res.json(savedNotes);
});


// =============================================================================
// LISTENER 

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});