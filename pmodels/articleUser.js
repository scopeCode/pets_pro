/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');


var ArticleUser = mysqlCient.sequelize.define('articleUser',
    {
        creator:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"creator",
            comment:'文章的创建者'
        },
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"type",
            comment:'文章类型 0：自创 1:转载'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'文件的状态'
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
        tableName:'articleUser'    //自定义表名
    }
);
exports.ArticleUser        =   ArticleUser;