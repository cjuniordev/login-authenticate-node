require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ==> Conectando  e autenticando base de dados
const database = require('./config/db.config');

database
  .authenticate()
  .then(console.log('Connection has been established successfully.'))
  .catch((err) => {
    console.log(`Unable to connect to the database: ${err}`);
  });
database.sync();

// ==> Rotas da API:
const index = require('./routes/index');
const userRoutes = require('./routes/user.routes');
const logRoutes = require('./routes/log.routes');
const authRoutes = require('./routes/auth.routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors('*'));

app.use(index);
app.use(userRoutes);
app.use(logRoutes);
app.use(authRoutes);

module.exports = app;
