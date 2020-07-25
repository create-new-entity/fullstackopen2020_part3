require('dotenv').config();
const mongoose = require('mongoose');
const url = process.env.MONGO_URI;
const Person = require('./models/Person');

mongoose
  .connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(
    console.log('DB connected')
  )
  .catch(error => {
    console.log(error);
    console.log('DB connection failed')
  });

if(process.argv.length === 2){
  Person
    .find({})
    .then(result => {
      result.forEach(person => console.log(person));
    })
}
else {
  let newPerson = {
    name: process.argv[2],
    number: process.argv[3]
  }
  newPerson = new Person(newPerson);
  newPerson
    .save()
    .then(result => {
      console.log(`${result} saved!!`);
      mongoose.connection.close();
    });
}

