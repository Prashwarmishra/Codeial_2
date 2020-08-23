const express = require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const { setAuthenticatedUser } = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const flashMware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'compressed',
    prefix: '/css'
}));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('assets'));


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'Codeial',
    secret: 'blahblah',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (100*60*1000)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || "Connect-Mongo connection Okay.")
    })
}));

app.use(passport.initialize())
app.use(passport.session());
app.use(setAuthenticatedUser);

app.use(flash());
app.use(flashMware.setFlash);

app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){console.log(`There's an error while connecting to the server: ${err}`); return;}

    console.log(`The Server is running at the port: ${port}`);
});