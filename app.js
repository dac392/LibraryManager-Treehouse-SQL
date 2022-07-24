var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./models/index');
// const {Op} = db.Sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const sequelize = require('sequelize');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  const err = new Error(`Oh no! Your request to the path: ${req.url} could not be fulfilled. Something may have been misspelled, or the path may not exist. Please try again or return to the home menue`);
  err.status = 404;
  err.url = req.url;
  res.status(err.status);

  next(err);
});

// error handler
app.use((error, req, res, next)=>{
    
  if(error.status === 404){
    error.title = "Page-Not-Found"
      res.status(error.status).render("page-not-found", { error });
  }else{
      error.message = (error.message||`Oops! It looks like something went wrong on the server.`);
      error.status = (error.status||500);
      error.url = req.url;
      error.title = "server-error"
      res.status(error.status).render("error", { error });
  }
});


module.exports = app;
