const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dbURL = require('./Config/db')

const app = express()

// Middleware

app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser());

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const connection = mongoose.connection;

connection.once("open", function(){
    console.log("Database connected")
})

app.use('/api/auth', require('./Routes/auth'));
app.use('/api/user', require('./Routes/user'));

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))