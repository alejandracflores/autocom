const morgan = require('morgan');
const express = require('express');
const app = express();

// Routers

// Middlewares
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const cors = require('./middleware/cors');

// App
app.use(morgan('dev'));
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', index);

app.use(notFound);

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor en funcionamiento...');
  });