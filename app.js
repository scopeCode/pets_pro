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
var routes        =     require("./router");

//require("./pmodels/models");


var options = {
    helpers: [
        './common/dustHelper'
    ],
    cache: false
};

app.engine("dust",dustjs.dust(options));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(path.join(__dirname, 'public', 'logo.png')));

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

// set static, dynamic helpers   最后的时候进行调整,前端静态的加载
/*_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets: assets
});*/

routes(app);
module.exports = app;