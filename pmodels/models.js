/**
 * 全部模型的定义  ——  需要优化 进行 拆分成 单个文件进行存储
 * Created by scj-mo on 2015/12/24.
 */

var User            =   require('./user').User;
var Info            =   require('./info').Info;
var Article         =   require('./article').Article;
var File            =   require('./file').File;
var Tag             =   require('./tag').Tag;
var Log             =   require('./log').Log;
var Hot             =   require('./hot').Hot;
var logger          =   require('./logger').SysLogger;

var UserFollow      =   require('./userFollow').UserFollow;

var ArticleTag      =   require('./articleTag').ArticleTag;
var ArticleFile     =   require('./articleFile').ArticleFile;
var ArticleLog      =   require('./articleLog').ArticleLog;
var ArticleHot      =   require('./articleHot').ArticleHot;
var ArticleUser     =   require('./articleUser').ArticleUser;
var ArticleComment  =   require('./articleComment').ArticleComment;


exports.User        =  User;
exports.Info        =  Info;
exports.UserFollow  =  UserFollow;
exports.Article     =  Article;
exports.File        =  File;
exports.Tag         =  Tag;
exports.Log         =  Log;
exports.Hot         =  Hot;
exports.logger      =  logger;

exports.ArticleTag      =  ArticleTag;
exports.ArticleFile     =  ArticleFile;
exports.ArticleLog      =  ArticleLog;
exports.ArticleHot      =  ArticleHot;
exports.ArticleUser     =  ArticleUser;
exports.ArticleComment  =  ArticleComment;

User.hasOne(Info);
Info.belongsTo(User);

User.hasMany(UserFollow);
UserFollow.belongsTo(User);

Article.belongsToMany(File, {'through': ArticleFile});
File.belongsToMany(Article, {'through': ArticleFile});

Article.belongsToMany(Tag, {'through': ArticleTag});
Tag.belongsToMany(Article, {'through': ArticleTag});

Article.belongsToMany(Log, {'through': ArticleLog});
Log.belongsToMany(Article, {'through': ArticleLog});

Article.belongsToMany(Hot, {'through': ArticleHot});
Hot.belongsToMany(Article, {'through': ArticleHot});

Article.belongsToMany(User,{'through': ArticleUser});
User.belongsToMany(Article,{'through': ArticleUser});

Article.hasMany(ArticleComment);
ArticleComment.belongsTo(Article);

/*
User.sync({force: true}).then(function () {});
Info.sync({force: true}).then(function () {});
UserFollow.sync({force: true}).then(function () {});

Article.sync({force: true}).then(function () {});
File.sync({force: true}).then(function () {});
Tag.sync({force: true}).then(function () {});
Log.sync({force: true}).then(function () {});
Hot.sync({force: true}).then(function () {});

ArticleTag.sync({force: true}).then(function () {});
ArticleFile.sync({force: true}).then(function () {});
ArticleLog.sync({force: true}).then(function () {});
ArticleHot.sync({force: true}).then(function () {});
ArticleUser.sync({force: true}).then(function () {});
ArticleComment.sync({force: true}).then(function () {});
logger.sync({force: true}).then(function () {});*/