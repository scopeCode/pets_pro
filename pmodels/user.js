/**
 * 用户信息模型
 * Created by scj-mo on 2015/12/6.
 */
var mysqlCient   =   require("./index");
var User = mysqlCient.sequelize.define('T_B_USER',
    {
        id : {
            type : mysqlCient.Sequelize.BIGINT,
            autoIncrement : true,
            primaryKey : true,
            unique : true,
            field:'ID',
            comment:'主键,自动增长 bigint 长整形'
        },
        userName:{
            type:mysqlCient.Sequelize.STRING,
            field:"USER_NAME",
            comment:'登录的用户名,手机号,数据库提供默认的正则的验证.',
            validate:{
                is:/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
            }
        },
        userPwd:{
            type:mysqlCient.Sequelize.STRING,
            field:"USER_PWD",
            comment:'登录密码,MD5加密'
        },
        registerIp:{
            type:mysqlCient.Sequelize.STRING,
            field:"REGISTER_IP",
            comment:'注册的IP地址,默认是 REQ 获得的数据'
        },
        registerTime:{
            type:mysqlCient.Sequelize.DATE,
            field:"REGISTER_TIME",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'注册的时间,注意是否是需要进行时区的设定.'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"STATUS",
            defaultValue: true,
            comment:'用户的初始状态'
        }
    },
    {
        freezeTableName: true,  //冻结表名_使用自己设定的表名进行定义
        timestamps:false,       //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'T_B_USER'    //自定义表名
    }
);
exports.User = User;

/*
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var UserSchema  = new Schema({
    USER_NAME       :   {type   :   String                              },      //用户名
    USER_PWD        :   {type   :   String                              },      //用户密码
    REGISTER_IP     :   {type   :   String                              },      //注册IP
    REGISTER_TIME   :   {type   :   Date    ,default    :   Date.now    },      //创建时间
    STATUS          :   {type   :   Boolean ,default    :   true        },      //用户的状态 true 正常 false 禁用 不可登录系统，不可评论
});

mongoose.model('User',UserSchema);      //将UserSchema 添加到  mongoose模型中
*/