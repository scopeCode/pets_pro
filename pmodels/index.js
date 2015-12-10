/**
 * 建立mongoose对象,引入数据库模型
 * Created by WG on 2015/11/28.
 */

//建立mongodb的链接
var mongoose = require('mongoose');
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

require('./article');
require('./articleUser');
require('./articleFile');

//用户基本信息的model
exports.User            =   mongoose.model('User');
exports.UserInfo        =   mongoose.model('UserInfo');

//文章的基本信息的model
exports.Article            =   mongoose.model('Article');
exports.ArticleUser        =   mongoose.model('ArticleUser');
exports.ArticleFile        =   mongoose.model('ArticleFile');