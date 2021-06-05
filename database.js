const mongoose = require('mongoose');

const initDB = () => {
  mongoose.connect('mongodb://localhost:27017/lifechatdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once('open', () => {
    console.log('✅  Connected to database');
  });
};

module.exports = initDB;
