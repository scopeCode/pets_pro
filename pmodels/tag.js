/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');
var Tag = mysqlCient.sequelize.define('tag',
    {
        tagName:{
            type:mysqlCient.Sequelize.STRING,
            field:"tagName",
            comment:'标签名称'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'用户的初始状态'
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
        tableName:'tag'    //自定义表名
    }
);
exports.Tag         =   Tag;