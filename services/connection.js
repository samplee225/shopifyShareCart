const mongoose = require('mongoose');

const conectionString = process.env.MONGODB_URI ;
mongoose.connect(conectionString)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;