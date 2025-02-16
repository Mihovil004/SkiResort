require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const csrf = require('csurf');
const parseForm = bodyParser.urlencoded({ extended: false });
const csrfProtection = csrf({ cookie: true });

const errorRoutes = require('./routes/errorRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SECRET_KEY || 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(flash());
app.use(csrfProtection);

// Routes
app.use('/errors', errorRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).send('Form tampered with.');
  } else {
    res.redirect(`/errors/500`);
  }
});

// 404 handler
app.use((req, res) => {
  res.redirect(`/errors/404`);
});

app.listen(port, () => {
  console.log(`Ski Resort app listening at http://localhost:${port}`);
});
