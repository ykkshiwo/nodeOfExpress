var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));
 
app.get('/handlebars1', function(req, res){
    res.render('form_login')
})

app.get('/awesome', function(req, res){
    
    if(req.session.lastPage) {
        console.log('Last page was: ' + req.session.lastPage + ".");    
    }    
    req.session.lastPage = '/awesome'; //每一次访问时，session对象的lastPage会自动的保存或更新内存中的session中去。
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