const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose')
const env = require('dotenv');
const path = require('path');

env.config()
const port = process.env.PORT || 3000
const app = express();

app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 500 * 60 * 60 * 1000, // expires after 500 hours in milliseconds
    },
  })
);
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// page routes
const pages = require('./routes/page_routes')
app.use(pages)

const user = require('./routes/user_routes')
app.use(user)

const products = require('./routes/product_routes')
app.use(products)

const orders = require('./routes/order_routes')
app.use(orders)

const admin = require('./routes/admin_routes')
app.use(admin)

app.get('*', (req,res) => {
  res.render('Error404')
})

mongoose.connect( process.env.MongoDB_URL || "mongodb://127.0.0.1:27017/GYMER?retryWrites=true&w=majority")
.then(console.log(`MongoDB Conneted (${process.env.MongoDB_URL || "mongodb://127.0.0.1:27017/GYMER?retryWrites=true&w=majority"})`))
.then(app.listen(port, () => { console.log(`Server Listen On ${port}`)}))
.catch(err => {console.log("An error occured at Mongo Connection\n" + err)})