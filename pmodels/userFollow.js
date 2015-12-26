/**
 * 用户关注信息表
 * Created by WG on 2015/12/26.
 */

var mysqlCient = require('../pmodels/index');


var UserFollow = mysqlCient.sequelize.define('userFollow',
    {
        followUserId:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"followUserId",
            comment:'被关注的人的ID'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'创建时间.'
        }
    },
    {
        freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
        timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'userFollow'      //自定义表名
    }
);
exports.UserFollow        =   UserFollow;