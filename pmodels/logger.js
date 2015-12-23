/**
 * 日志模型表
 * Created by scj-mo on 2015/12/11.
 */
var mysqlCient   =   require("./index");
var SysLogger = mysqlCient.sequelize.define('sysLog',
    {
        userId:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"userId",
            comment:'用户表的主键ID'
        },
        type:{
            type:mysqlCient.Sequelize.STRING,
            field:"type",
            comment:'日志类型'
        },
        content:{
            type:mysqlCient.Sequelize.STRING,
            field:"content",
            comment:'日志内容'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'创建时间.'
        }
    },
    {
        freezeTableName: true,  //冻结表名_使用自己设定的表名进行定义
        timestamps:false,       //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'sysLog'    //自定义表名
    }
);
exports.SysLogger = SysLogger;

//SysLogger.sync({force: true}).then(function () {});