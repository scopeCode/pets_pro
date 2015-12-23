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
    },
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
};
exports.sequelize  = new Sequelize(config.database, config.username, config.password, config.options);
exports.Sequelize  = Sequelize;

//引入数据表的对象
var models          =   require('./models');
var logger          =   require('./logger');

exports.User        =   models.User;
exports.Info        =   models.Info;
exports.Article     =   models.Article;
exports.File        =   models.File;
exports.Tag         =   models.Tag;
exports.Log         =   models.Log;
exports.Hot         =   models.Hot;
exports.SysLogger   =   logger.SysLogger;