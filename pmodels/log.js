/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');

var Log = mysqlCient.sequelize.define('log',
    {
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"type",
            comment:'类型操作符  1:热度 2:评论  3：转发'
        },
        content:{
            type:mysqlCient.Sequelize.STRING,
            field:"content",
            comment:'文章日志的内容'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'状态'
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
        tableName:'log'    //自定义表名
    }
);
exports.Log = Log;