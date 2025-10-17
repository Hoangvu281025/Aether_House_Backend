var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();




var indexRouter = require('./src/routes/index');
var categoriesRouter = require('./src/routes/category');
var usersRouter = require('./src/routes/users');
var authRouter = require('./src/routes/auth');
var rolesRouter = require('./src/routes/role');
var productsRouter = require('./src/routes/product');
var storeRouter = require('./src/routes/store');
var addressRouter = require('./src/routes/address');
var variantRouter = require('./src/routes/product_variant');
var oderRouter = require('./src/routes/order');
var voucherRouter = require('./src/routes/voucher');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/stores', storeRouter);
app.use('/api/address', addressRouter);
app.use('/api/variants', variantRouter);
app.use('/api/orders', oderRouter);
app.use('/api/vouchers', voucherRouter);


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Kết nối Database thành công"))
  .catch((err) => console.log(err));
// error handler

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại cổng ${port}`);
});
