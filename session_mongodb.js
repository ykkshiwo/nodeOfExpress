var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
// var handlebars = require('express3-handlebars')
// .create({ defaultLayout:'main' });

// app.engine('handlebars', handlebars.engine);
// app.set('view engine', 'handlebars');
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
    cookie: {maxAge: 300000 },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({   //创建新的mongodb数据库
        // host: 'localhost',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
        // port: 27017,          //数据库的端口号
        // db: 'test-app'        //数据库的名称。
        url:'mongodb://127.0.0.1:27017/test-app'
    })
}));

app.get('/handlebars1', function(req, res){
    res.render('form_login')
})

function checkLogin(req, res, next){
    if(!req.session.user){
        res.redirect('/login');
    }
    else{
        next()
    }
}

function checkNotLogin(req, res, next){
    if(req.session.user){
        console.log('已经登入了，跳转···')
        res.redirect('/welcome')
    }
    else{
        next()
    }
}

app.get('/reg', function(req, res){
    res.render('form_reg')
})

app.post('/reg', urlencodedParser, function(req, res){
    console.log("/reg go")
    MongoClient.connect(db_url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("my-website");
        var myobj = { name: req.body.username, password: req.body.password };
        dbo.collection("users").insertOne(myobj, function(err, ress) {
            if (err) throw err;
            console.log("文档插入成功");
            db.close();
            res.redirect('/regsuccess')
        });
    });
})

app.get('/regsuccess', function(req, res){
    res.send("注册成功")
})

app.get('/', function(req, res){
    res.render('form_login')
})

app.post('/login', checkNotLogin);
app.post('/login', urlencodedParser, function(req, res){
    MongoClient.connect(db_url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("my-website");
         var whereStr = {"name":req.body.username};  // 查询条件
        dbo.collection("users").find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            if(result[0].password === req.body.password){
                req.session.user = req.body.username
                res.redirect('/welcome')
            }
            else{
                res.redirect('/error')
            }
            db.close();
        });
    });
})

app.get('/error', function(req, res){
    res.send("登入失败")
})

app.get('/login', checkNotLogin);
app.get('/login', function(req, res){
    res.redirect('/')
})

app.get('/logout', function(req, res){
    req.session.user = null
    res.send("exit")
})

app.get('/welcome', function(req, res){
    // res.render('welcome', {name: req.session.user})
    console.log(req.session.user)
    res.send(req.session.user)
})

app.get('/something', checkLogin)
app.get('/something', function(req, res){
    res.send("如果你看到了这段文字， 说明你登入了。")
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