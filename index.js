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

app.get('/api/info', (req, res, error) => {
  Person
    .countDocuments({})
    .then((result) => {
      res.send(`
        <p>Phonebook has info of ${result} people.</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error));
  ;
});

app.get('/api/persons/:id', (req, res) => {
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

app.put('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => next(error));
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
  res.json(error);
};

app.use(errorHandler);


app.listen(PORT);
