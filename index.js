const express = require('express');
const { response } = require('express');

const app = express();
const PORT = 3001;



let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];


app.get('/api/persons', (req, res) => {
  res.json(notes);
});

app.get('/api/info', (req, res) => {
  res.send(`
  <p>Phonebook has info of ${notes.length} people.</p>
  <p>${new Date()}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  let note = notes.find(note => note.id === Number(req.params.id));
  if(note) res.send(note.content);
  else res.status(404).send('Not Found');
});

app.delete('/api/persons/:id', (req, res) => {
  notes = notes.filter(note => note.id !== Number(req.params.id));
  res.status(204).send();
});


app.listen(PORT);
