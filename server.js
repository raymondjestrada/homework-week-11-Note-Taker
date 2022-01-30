const express = require("express");
const path = require("path")
const app = express();
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);


const writeToFile = (destination, content) => {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => {
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
    });

};

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};




// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
     // Read the db.json file and return all saved notes as JSON.
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});



// POST Route for a new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
     // Receives a new note, adds it to db.json, then returns the new note
    const { title, text } = req.body

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding note');
    }
});


// Deletes a note with specific id
app.delete("/api/notes/:id", function(req, res) {
    readFromFile('./db/db.json').then((data) => {
        const notes = JSON.parse(data)
        const newNotes = notes.filter((note) => {
            return note.id !== req.params.id

        })
        writeToFile('./db/db.json', newNotes) 
        res.json(newNotes)
        console.log("Deleted note with id "+req.params.id);
    })
  
});


app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);



//updates the json file whenever a note is added or deleted
function updateDb() {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => {
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
     });
}




app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`)
})


