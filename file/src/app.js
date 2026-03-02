// app.js
const express = require('express');
const bodyParser = require('body-parser');
const fileRoutes = require('./routes/file.routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/files', fileRoutes);

app.use(errorHandler);

module.exports = app;
