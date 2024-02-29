const express = require('express');
const cors = require('cors'); // Require the cors package
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Importing the version 4 of uuid to generate unique IDs
const app = express();

// Example: Allowing a specific origin
const corsOptions = {
    origin: 'http://localhost:3000',
  };
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Right place to add the middleware for serving static files
app.use(express.static('public'));

// Serve 'notes.html' for requests to '/notes'
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'note-taker', 'public', 'notes.html'));
});

// Serve 'index.html' for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'note-taker', 'public', 'index.html'));
});

// API Route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading notes data.' });
    }
    res.json(JSON.parse(data));
  });
});

// API Route to create a new note
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };

  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading notes data.' });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving the new note.' });
      }
      res.json(newNote);
    });
  });
});

// Bonus: API Route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading notes data.' });
    }
    const notes = JSON.parse(data).filter(note => note.id !== noteId);

    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error deleting the note.' });
      }
      res.json({ message: 'Note has been deleted successfully.' });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

