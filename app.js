var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var registrationRouter = require('./routes/registration');
var loginRouter = require('./routes/login');
var addProfileRouter = require('./routes/addProfile');
var userProfileInfo = require('./routes/userProfileInfo');

var app = express();

const tokensTablePath = path.join(__dirname, "./public/database/tokens.json");
let tokensTable = JSON.parse(fs.readFileSync(tokensTablePath));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const token = req.cookies.token;
  const tokensObject = tokensTable.find(item => item.token === token);
  const tokenValid = tokensObject !== undefined && new Date(tokensObject.expires).getTime() > Date.now() ? true : false;

  console.log('CHECK iIF USER LOGGED IN');
  console.log("token", token);
  console.log("tokensObject", tokensObject);
  console.log("tokenValid", tokenValid);

  if (tokenValid) {
    res.$meta = {
      isLoggedIn: true,
      userId: tokensObject.userId
    };
  } else {
    res.$meta = {
      isLoggedIn: false
    };
  }

  next();
    /* Читаем куки пользователя. Смотрим есть ли в них токен. Если есть токен, то мы проверяем есть ли такой токен в базе и валиден ли он (не заэкспайрился).
     Если токен валиден, то мы можен записать id пользователя в response объект. */
    
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/registration', registrationRouter);
app.use('/login', loginRouter);
app.use('/add-profile', addProfileRouter);
app.use('/user-profile-info', userProfileInfo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
