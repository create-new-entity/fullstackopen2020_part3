require('dotenv').config();
const mongoose = require('mongoose');
const url = process.env.MONGO_URI;

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
    console.log('DB connection failed', error);
  });

mongoose.set('useCreateIndex', true);

module.exports = mongoose;

