const mongoose = require('mongoose');
const { uri } = require('./config').database;

const initDB = async () => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  mongoose.connection.once('open', () => {
    console.log('✅  Connected to database');
  });
};

module.exports = initDB;
