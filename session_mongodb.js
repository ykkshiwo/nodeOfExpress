var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
 
// ... 
 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser

var urlencodedParser = bodyParser.urlencoded({ extended: false })

// var server = new mongodb.Server('127.0.0.1', 27017)
// new mongodb.Db('my-website', server).open(function(err, client){
//     if(err) throw err;
//     console.log('\033[96m + \033[39m connected to mongodb')
// })

const MongoClient = require('mongodb').MongoClient;
const db_url = "mongodb://localhost:27017/my-website";
 
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("\033[96m + \033[39m connected to mongodb");
//   db.close();
// });

var app = express();
app.set('view engine', 'jade')

app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',
    cookie: {maxAge: 80000 },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({   //创建新的mongodb数据库
        // host: 'localhost',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
        // port: 27017,          //数据库的端口号
        // db: 'test-app'        //数据库的名称。
        url:'mongodb://127.0.0.1:27017/test-app'
    })
}));

app.get('/', function(req, res){
    res.render('form')
})

app.post('/login', urlencodedParser, function(req, res){
    MongoClient.connect(db_url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("my-website");
        var myobj = { name: req.body.username, password: req.body.password };
        dbo.collection("users").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("文档插入成功");
            db.close();
        });
    });
    res.redirect('/welcome')
})

app.get('/welcome', function(req, res){
    res.render('welcome', {name: 'cst'})
})

app.get('/awesome', function(req, res){
    
    if(req.session.lastPage) {
        console.log('Last page was: ' + req.session.lastPage + ".");    
    }    
    req.session.lastPage = '/awesome';
    res.send("You're Awesome. And the session expired time is: " + req.session.cookie.maxAge);
});

app.get('/radical', function(req, res){
    if (req.session.lastPage) {
        console.log('Last page was: ' + req.session.lastPage + ".");    
    }
    req.session.lastPage = '/radical';
    res.send('What a radical visit! And the session expired time is: ' + req.session.cookie.maxAge);
});

app.get('/tubular', function(req, res){
    if (req.session.lastPage){
        console.log("Last page was: " + req.session.lastPage + ".");    
    }

    req.session.lastPage = '/tubular';
    res.send('Are you a suffer? And the session expired time is: ' + req.session.cookie.maxAge);
});


app.listen(5000);