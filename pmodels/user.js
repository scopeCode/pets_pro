/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');

var User = mysqlCient.sequelize.define('user',
    {
        userName:{
            type:mysqlCient.Sequelize.STRING,
            field:"userName",
            comment:'登录的用户名,手机号,数据库提供默认的正则的验证.',
            validate:{
                is:/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
            }
        },
        userPwd:{
            type:mysqlCient.Sequelize.STRING,
            field:"userPwd",
            comment:'登录密码,MD5加密'
        },
        ip:{
            type:mysqlCient.Sequelize.STRING,
            field:"ip",
            comment:'注册的IP地址,默认是 REQ 获得的数据'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'注册的时间,注意是否是需要进行时区的设定.'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'用户的初始状态'
        }
    },
    {
        freezeTableName: true,  //冻结表名_使用自己设定的表名进行定义
        timestamps:false,       //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'user'    //自定义表名
    }
);

exports.User        =   User;