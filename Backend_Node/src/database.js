const mongoose = require('mongoose');

const URI = process.env.URI;

mongoose.connect(URI, () => console.log('DB connected'));
