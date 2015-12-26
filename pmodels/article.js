/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');
var Article = mysqlCient.sequelize.define('article',
    {
        title:{
            type:mysqlCient.Sequelize.STRING,
            field:"title",
            comment:'文章的标题.'
        },
        content:{
            type:mysqlCient.Sequelize.STRING(1024),
            field:"content",
            comment:'文章的内容'
        },
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"type",
            comment:'文章的类型 1:文字2：图片3：链接4：视频'
        },
        count:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"count",
            defaultValue:0,
            comment:'文章的热度值'
        },
        status:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue:true,
            comment:'文章的状态.'
        },
        created:
        {
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue: mysqlCient.Sequelize.NOW,
            comment:'创建时间'
        }
    },
    {
        freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
        timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'article'     //自定义表名
    }
);
exports.Article     =   Article;