const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const log = require('./src/middlewares/log');
const cors = require('cors');
const session = require('express-session');
const app = express();


const apiRouter = require('./src/routes/api/apiRoutes');
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');
const productsRouter = require('./src/routes/product');
const cartRoutes = require('./src/routes/cartRoutes');




// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(cors({
  origin:'http://localhost:5173'
}));
app.use(session({
secret:'Esta es la pagina de ivo :D ',
resave: true,
saveUninitialized: true,
cookie: { secure: false }
}));

// mis middlewares
app.use(log);
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = []; // 🔹 Inicializa el carrito si no existe
    console.log("✅ Carrito inicializado:", req.session.cart);
  }
  next();
});



app.use('/', indexRouter);
app.use('/api', apiRouter)
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRoutes);


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
