/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');


var Hot = mysqlCient.sequelize.define('hot',
    {
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'状态'
        },
        userId:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"userId",
            comment:'用户的ID'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'创建时间.'
        }
    },
    {
        freezeTableName: true,          //冻结表名_使用自己设定的表名进行定义
        timestamps:false,               //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'hot'             //自定义表名
    }
);
exports.Hot = Hot;