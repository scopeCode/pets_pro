/**
 * 日志模型表
 * Created by scj-mo on 2015/12/11.
 */
var mysqlCient   =   require("./index");
var SysLogger = mysqlCient.sequelize.define('T_B_SYS_LOG',
    {
        id : {
            type : mysqlCient.Sequelize.BIGINT,
            autoIncrement : true,
            primaryKey : true,
            unique : true,
            field:'ID',
            comment:'主键,自动增长 bigint 长整形'
        },
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"TYPE",
            comment:'日志类型'
        },
        content:{
            type:mysqlCient.Sequelize.STRING,
            field:"CONTENT",
            comment:'日志内容'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"CREATED",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'创建时间.'
        }
    },
    {
        freezeTableName: true,  //冻结表名_使用自己设定的表名进行定义
        timestamps:false,       //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'T_B_SYS_LOG'    //自定义表名
    }
);
exports.SysLogger = SysLogger;

/*
    var mongoose        =   require('mongoose');
    var Schema          = mongoose.Schema;

    var LoggerSchema  =   new Schema({
        TYPE        :   {type   :   String                              },      //日志类型
        CONTENT     :   {type   :   String                              },      //日志内容
        CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
    });

    mongoose.model('Logger',LoggerSchema);
*/