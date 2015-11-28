var express       =     require('express');
var session       =     require('express-session');
var dustjs        =     require('adaro');
var path          =     require('path');
var favicon       =     require('serve-favicon');
var cookieParser  =     require('cookie-parser');
var bodyParser    =     require('body-parser');
var compression   =     require('compression');
var app           =     express();

var cfg           =     require('./config');

app.engine("dust",dustjs.dust({ cache: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use(session({
    secret              :   cfg.session_secret,
    resave              :   true,
    saveUninitialized   :   false,
    cookie              :   {
        maxAge  :   cfg.session_time
    }
}));

module.exports = app;