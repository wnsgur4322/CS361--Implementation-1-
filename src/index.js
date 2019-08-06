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
    "Derek": {
        "password": "derek"
    },
    "Sam": {
        "password": "samuel"
    },
    "Youli": {
        "password": "youli"
    },
    "Kara": {
        "password": "kara"
    },
    "Aleks": {
        password: "aleks"
    }
};



app.get('/', function(req, res, next) {
    if (req.session.logged_in_userid) {
        res.send(`${req.session.logged_in_userid} logged in`);
    }
    else {
        res.render('login');
    }
});

app.post('/login', function(req, res, next){
    if (users[req.body.userid] && req.body.pswrd == users[req.body.userid].password) {
        req.session.logged_in_userid = req.body.userid;
        users[req.body.userid] = {
            "password": req.body.pswrd
        };
        res.send(`${req.session.logged_in_userid} logged in`);
    }
    else {
        context = {"login-error": "Invalid username or password"};
        res.render('login', context);
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
