/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');


var File = mysqlCient.sequelize.define('file',
    {
        fileHash:{
            type:mysqlCient.Sequelize.STRING,
            field:"fileHash",
            comment:'文章对应的 hash 码'
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
        tableName:'file'    //自定义表名
    }
);
exports.File        =   File;