const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3001;



let contacts = [
  {
    id: 1,
    name: "Snake",
    number: "122-34-4545"
  },
  {
    id: 2,
    name: "Miller",
    number: "122-34-423445"
  },
  {
    id: 3,
    name: "Rex",
    date: "456-324-34"
  }
];

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
})

app.use(cors());
app.use(express.json());
app.use(morgan(':body'));
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
  res.json(contacts);
});

app.get('/api/info', (req, res) => {
  res.send(`
  <p>Phonebook has info of ${contacts.length} people.</p>
  <p>${new Date()}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  let person = contacts.find(contact => contact.id === Number(req.params.id));
  if(person) res.send(person);
  else res.status(404).send('Not Found');
});

app.delete('/api/persons/:id', (req, res) => {
  contacts = contacts.filter(contact => contact.id !== Number(req.params.id));
  res.status(204).send();
});

app.post('/api/persons', (req, res) => {

  if(!req.body.name){
    res.status(400).json({
      error: "Name Missing"
    })
    return;
  };

  if(!req.body.number){
    res.status(400).json({
      error: "Number Missing"
    })
    return;
  };

  found = contacts.find((contact) => contact.name === req.body.name);
  if(found) {
    res.status(409).json({
      error: "Contact already exists."
    });
    return;
  }  

  let newContact = {};
  newContact.name = req.body.name;
  newContact.number = req.body.number;
  newContact.id = contacts.length + 1;
  contacts.push(newContact);
  res.json(newContact); 
});


app.listen(PORT);
