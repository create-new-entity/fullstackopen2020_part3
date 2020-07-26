const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/Person');

const app = express();
const PORT = process.env.PORT || 3001;

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.json());
app.use(morgan(':body'));
app.use(express.static('build'));

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(result => res.json(result))
    .catch(error => {
      next(error);
    });
});

app.get('/api/info', (req, res, next) => {
  Person
    .countDocuments({})
    .then((result) => {
      res.send(`
        <p>Phonebook has info of ${result} people.</p>
        <p>${new Date()}</p>
      `);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
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

app.put('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true, runValidators: true })
    .then(result => {
      if(result) res.status(200).json(result);
      else {
        let error = new Error;
        error.name = 'NotFound';
        throw error;
      }
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {

  if(!req.body.name){
    res.status(400).json({
      error: 'Name Missing'
    });
    return;
  }

  if(!req.body.number){
    res.status(400).json({
      error: 'Number Missing'
    });
    return;
  }


  new Person(
    {
      name: req.body.name,
      number: req.body.number
    }
  )
    .save()
    .then(result => res.status(200).json(result))
    .catch(error => {
      next(error);
    });
});


const errorHandler = (error, req, res) => {
  if(error.name === 'ValidationError'){
    res.status(400).json({
      error: error.message
    });
  }
  else if(error.name === 'NotFound'){
    res.status(404).send();
  }
  else res.status(404).json(error);
};

app.use(errorHandler);


app.listen(PORT);
