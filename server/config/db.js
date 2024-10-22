const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://jacksonaguiar:1234wsa12@cluster0.1heregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
