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
var User                =   require('./user').User;
var UserInfo            =   require('./userInfo').UserInfo;
var Article             =   require('./article').Article;
var ArticleUser         =   require('./articleUser').ArticleUser;
var ArticleFile         =   require('./articleFile').ArticleFile;
var SysLogger           =   require('./logger').SysLogger;

exports.User                =   User;
exports.UserInfo            =   UserInfo;
exports.Article             =   Article;
exports.ArticleUser         =   ArticleUser;
exports.ArticleFile         =   ArticleFile;
exports.SysLogger           =   SysLogger;

//设定对应的逻辑
UserInfo.belongsTo(User,{as:'User',foreignKey:'USER_ID'});
/*
User.sync({force: true}).then(function () {});
UserInfo.sync({force: true}).then(function () {});
Article.sync({force: true}).then(function () {});
ArticleUser.sync({force: true}).then(function () {});
ArticleFile.sync({force: true}).then(function () {});
SysLogger.sync({force: true}).then(function () {});*/


//建立mongodb的链接
/*var mongoose = require('mongoose');
var config   = require('../config');

mongoose.connect(config.mongodb, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.mongodb, err.message);
        process.exit(1);
    }
});
 //引入用户基本表 和 用户信息表
 require('./user');
 require('./userInfo');
 //----
 require('./article');
 require('./articleUser');
 require('./articleFile');

 require('./logger');

 //用户基本信息的model
 exports.User                =   mongoose.model('User');
 exports.UserInfo            =   mongoose.model('UserInfo');
 //文章的基本信息的model
 exports.Article             =   mongoose.model('Article');
 exports.ArticleUser         =   mongoose.model('ArticleUser');
 exports.ArticleFile         =   mongoose.model('ArticleFile');
 //系统日志的model
 exports.Logger              =   mongoose.model('Logger');
*/