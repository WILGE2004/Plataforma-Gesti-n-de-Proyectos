const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const authApi = require('./routes/auth.routes');
const projectsApi = require('./routes/projects.routes');

//settings
app.set('port', process.env.PORT || 8080);
app.set('secret_key', process.env.SECRET_KEY);

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

//routes
app.get('/', (req, res) => res.send('Home API'));
app.use('/auth', authApi);
app.use('/api', projectsApi);

module.exports = app;