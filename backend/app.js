const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

require('dotenv').config();

// Database connection
const database = require('./database/db');


// Middleware
app.use(cors({
    origin: 'http://localhost:5173/',
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

database();




module.exports = app;