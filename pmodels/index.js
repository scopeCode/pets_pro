/**
 * 建立mongoose对象,引入数据库模型
 * Created by WG on 2015/11/28.
 */
var mysql       =   require("mysql");
var Sequelize   =   require('sequelize');

var config ={
    database:'baby',
    username:'root',
    password:'root',
    options:{
        host:'127.0.0.1',
        port:'3306',
        dialect : 'mysql',
        timezone:'+08:00',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        define: {
            freezeTableName: true,
            timestamps:false
        }
    }
};
exports.sequelize  = new Sequelize(config.database, config.username, config.password, config.options);
exports.Sequelize  = Sequelize;
exports.mysqlCient = mysql;

//引入数据表的对象
var User                =   require('./article').User;
var UserInfo            =   require('./article').UserInfo;
var Article             =   require('./article').Article;
var ArticleUser         =   require('./article').ArticleUser;
var ArticleFile         =   require('./article').ArticleFile;
var ArticleTag          =   require('./article').ArticleTag;
var ArticleLog          =   require('./article').ArticleLog;
var ArticleHot          =   require('./article').ArticleHot;
var SysLogger           =   require('./logger').SysLogger;

exports.User                =   User;
exports.UserInfo            =   UserInfo;
exports.Article             =   Article;
exports.ArticleUser         =   ArticleUser;
exports.ArticleFile         =   ArticleFile;
exports.ArticleTag          =   ArticleTag;
exports.ArticleLog          =   ArticleLog;
exports.ArticleHot          =   ArticleHot;
exports.SysLogger           =   SysLogger;


//设定对应的逻辑

/*
User.sync({force: true}).then(function () {});
UserInfo.sync({force: true}).then(function () {});
Article.sync({force: true}).then(function () {});
ArticleFile.sync({force: true}).then(function () {});
ArticleUser.sync({force: true}).then(function () {});
ArticleTag.sync({force: true}).then(function () {});
ArticleLog.sync({force: true}).then(function () {});
ArticleHot.sync({force: true}).then(function () {});
SysLogger.sync({force: true}).then(function () {});*/