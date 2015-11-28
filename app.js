var express       =   require('express');       //web框架
var session       = require('express-session');
var dustjs        =   require('adaro');         //dustjs 渲染模块
var path          =   require('path');          //path  解析和转码的模块
var favicon       =   require('serve-favicon'); //favicon 显示模块
var cookieParser  =   require('cookie-parser');
var bodyParser    =   require('body-parser');
var compression   =   require('compression');

var app = express();

// 注册
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
    secret              :   'secret',                //关键KEY
    resave              :   true,
    saveUninitialized   :   false,
    cookie              :   {
        maxAge:1000*60*10           //失效时间为10分钟
    }
}));

module.exports = app;