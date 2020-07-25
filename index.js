const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const Person = require('./models/Person');

const app = express();
const PORT = process.env.PORT || 3001;

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
})

app.use(cors());
app.use(express.json());
app.use(morgan(':body'));
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(result => res.json(result))
    .catch(error => {
      next(error);
    });
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

app.delete('/api/persons/:id', (req, res, next) => {
  console.log(req.params.id);
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(error => {
      next(error);
    });
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


  Person
    .find({ name: req.body.name })
    .then(result => {

      if(result.length) res.status(409).json({
        error: "Contact already exists."
      });

      let newPerson = new Person({
        name: req.body.name,
        number: req.body.number
      });

      newPerson
        .save()
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
        
    });

});


const errorHandler = (error, req, res, next) => {
  console.log(error);
  res.json(error);
};

app.use(errorHandler);


app.listen(PORT);
