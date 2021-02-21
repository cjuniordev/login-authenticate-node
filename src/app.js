const express = require('express');
const cors = require('cors');

const app = express();

// ==> Conectando  e autenticando base de dados
const database = require('./config/db.config');
(async () => {
    try {
        await database.authenticate();
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.log(`Unable to connect to the database: ${err}`);
    }
    const sync = database.sync();
})

// ==> Rotas da API:
const index = require('./routes/index');
const userRoutes = require('./routes/user.routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use(index);
app.use(userRoutes);

module.exports = app;