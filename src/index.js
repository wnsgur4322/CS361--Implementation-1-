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

let port = 32416;
const args = process.argv;
if (args != null && args.length == 3) {
    port = args[2];
}
app.set('port', port);


let users = {
    "derek": {
        "password": "derek",
        "email": "derek@oregonstate.edu",
        "attendingPhysician": "Dr.John"
    },
    "sam": {
        "password": "sam",
        "email": "sam@oregonstate.edu",
        "attendingPhysician": "Dr.Wick"
    },
    "youli": {
        "password": "youli",
        "email": "youli@oregonstate.edu",
        "attendingPhysician": "Dr.Keanu"
    },
    "kara": {
        "password": "kara",
        "email": "kara@oregonstate.edu",
        "attendingPhysician": "Dr.Reeves"
    },
    "aleks": {
        "password": "aleks",
        "email": "aleks@oregonstate.edu",
        "attendingPhysician": "Dr.Boogeyman"
    },
    "john": {
      "password": "wick",
      "email": "dog@oregonstate.edu",
      "attendingPhysician": "This is technician account"
    }
};

let cases = {
    "55556": {
        "name": "John Doe"
    },
    "111178": {
        "name": "Sara Smith"
    },
    "4533": {
        "name": "Miles Davis"
    },
    "9976": {
        "name": "Chris Dave"
    },
    "9304": {
        "name": "Joni Mitchell"
    },
    "2314": {
        "name": "Tony Williams"
    }
}

app.get('/', function(req, res, next) {
    res.redirect('login');
});

app.get('/login', function(req, res, next) {
    if (req.session.logged_in_userid) {
        // req.session.logged_in_userid = null;
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
    if (req.session.logged_in_userid) {
        let content = {'name':req.session.logged_in_userid, 'email':users[req.body.userid].email, 'ap':users[req.body.userid].attendingPhysician};

        res.render('home', content)
    }
    else {
        return res.redirect('login');
    }
});

app.post('/case-search', function(req,res,next) {
    if (!req.session.logged_in_userid) {
        return res.redirect('login');
    }

    let searchstring = req.body.searchstring.trim();
    let matches = caseSearch(searchstring);

    let context = {};
    context.matches = matches;
    context.searchstring = searchstring;
    res.render('case_search', context);

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

app.get('/case', function(req, res){

    if (req.session.logged_in_userid) {
        let content = {'case_id':req.query.case_id};
        console.log(content);
        res.render('case', content)
    } else {
        console.log('else')
        return res.redirect('login');
    }
});

function caseSearch(searchStr) {
    let matches = []
    if (onlyDigits(searchStr)) {
        Object.keys(cases).forEach(function(caseNum) {
            if (caseNum.includes(searchStr)) {
                let match = {};
                match.caseNum = caseNum;
                match.name = cases[caseNum].name;
                matches.push(match);
            }
        });
    }
    else {
        Object.keys(cases).forEach(function(caseNum) {
            if (cases[caseNum]["name"].toLowerCase().includes(searchStr.toLowerCase())) {
                let match = {};

                match.caseNum = caseNum;
                match.name = cases[caseNum].name;
                matches.push(match);
            }
        })
    }
    console.log(matches[0]);
    return matches;
}

// https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
function onlyDigits(value) {
    return /^-{0,1}\d+$/.test(value);
}


app.use(function(req,res){
    res.status(404);

    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    console.log(err)
    res.status(500);
    res.render('500');
});

const serverName = "http://flip3.engr.oregonstate.edu";

app.listen(app.get('port'), function(){
    console.log(`Express started on ${serverName}:${app.get('port')}; press Ctrl-C to terminate.`);
});
