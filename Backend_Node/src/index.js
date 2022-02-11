require('dotenv').config();
const app = require('./app');
require('./database');

//server
app.listen(app.get('port'), () => console.log("Server running on port", app.get('port')));