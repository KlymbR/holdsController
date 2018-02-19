// var http = require('http')
var mongoose = require('mongoose')
var express = require('express')
var app = express()
var path = require('path')
var compression = require('compression')
var sass = require('node-sass-middleware')
var expressValidator = require('express-validator')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var port = 3000

// connect to database
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/climbing_room')
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.')
  process.exit()
})

// configuration of the server
app.set('port', process.env.PORT || port)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(compression())
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}))
app.set('trust proxy', true)
app.use(bodyParser.json())
app.use(expressValidator())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'work hard',
  store: new MongoStore({
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/climbing_room',
    autoReconnect: true
  })
}))

// routes
app.use('/', require('./routes/path'))
app.use('/', require('./routes/grip'))

// basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found')
})

// basic error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.response || 'Something broke!')
})

// start the server
if (module === require.main) {
  const server = app.listen(app.get('port'), () => {
    const port = server.address().port
    console.log(`App listening on port ${port}`)
  })
}

module.exports = app
