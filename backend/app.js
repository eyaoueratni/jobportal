const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const colors = require('colors');
require('dotenv').config();
const cors = require('cors');
const context=require('./middleware/context.js')
const {errorMiddleware }=require('./middleware/error.js')
const helmet=require('helmet')
const app=express();

//imports routes
const authroutes = require('./routes/authroutes.js');
const jobroutes = require('./routes/jobroutes.js');
const application=require('./routes/applicationroutes.js');
const fileUpload=require("express-fileupload");
//connection db
const connectDB = require('./config/db.js');
connectDB();


app.use(cookieParser());
app.use(express.json());
//middleware 
app.use(bodyparser.json({ limit: "5mb" }));
app.use(bodyparser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['POST', 'GET', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));


const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');

// Middleware pour attacher le contexte à chaque demande
app.use((req, res, next) => {
  req.context = context;
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'style-src': ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
//routes 
app.use('/api/user', authroutes);
app.use('/api/job', jobroutes);
app.use('/api/application',application)
app.get('/api/user/logout', (req, res) => {
  res.clearCookie('token'); // Assuming 'token' is the name of your authentication cookie
  res.status(200).json({ message: 'Logout successful' });
});
//error middleware 
app.use(errorMiddleware);
//port 
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server running on port ${port}`.bgCyan.white);
})
