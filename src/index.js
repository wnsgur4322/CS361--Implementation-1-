const express = require('express');

const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(session({
    secret:'aVerySecurePassword',
    resave: false,
    saveUninitialized: false
}));

let port = 32415;
const args = process.argv;
if (args != null && args.length == 3) {
    port = args[2];
}
app.set('port', port);


let users = {
    "derek": {
        "password": "derek"
    },
    "sam": {
        "password": "samuel"
    },
    "youli": {
        "password": "youli"
    },
    "kara": {
        "password": "kara"
    },
    "aleks": {
        password: "aleks"
    }
};



app.get('/', function(req, res, next) {
    res.redirect('login');
});

app.get('/login', function(req, res, next) {
    if (req.session.logged_in_userid) {
        req.session.logged_in_userid = null;
        // res.send(`${req.session.logged_in_userid} logged in`);
        res.redirect('/home')
    }
    else {
        return res.render('login');
    }
});

app.post('/login', function(req, res, next){
    let content = {'name':req.body.userid};
    req.body.userid = req.body.userid.toLowerCase();
    req.session.logged_in_userid = req.body.userid;
    if (users[req.body.userid] && req.body.pswrd === users[req.body.userid].password) {
        console.log('inside')
        users[req.body.userid] = {
            "password": req.body.pswrd
        };
        // res.send(`${req.session.logged_in_userid} logged in`);
        res.redirect('home')
    }
    else {
        context = {"login-error": "Invalid username or password"};
        res.render('login', context);
    }
});

app.get('/home', function(req, res){
    let content = {'name':req.session.logged_in_userid};
    res.render('home', content)
});

app.get('/logout', function(req, res, next) {
    if (req.session.logged_in_userid) {
        req.session.logged_in_userid = null;
        return res.redirect('login');
    }
    else {
        return res.redirect('login');
    }
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

const serverName = "http://flipX.engr.oregonstate.edu";

app.listen(app.get('port'), function(){
    console.log(`Express started on ${serverName}:${app.get('port')}; press Ctrl-C to terminate.`);
});
