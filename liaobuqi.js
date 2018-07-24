var express = require('express')
var mongodb = require('mongodb')

app = express()

// app.use(express.bodyParser());
// app.use(express.cookieParser());
// app.use(express.session({secret: 'my secret'}))

app.set('view engine', 'jade')

app.get('/', function(req, res){
    res.render('index', {authenticated: false})
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/signup', function(req, res){
    res.render('signup');
})

app.listen(3000)