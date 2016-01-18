/**
 * Created by scj-mo on 2016/1/9.
 */


var mysqlCient = require('../pmodels/index');

var ArticleComment = mysqlCient.sequelize.define('articleComment',
    {
        userId:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"userId",
            comment:'用户的ID'
        },
        comment:{
            type:mysqlCient.Sequelize.STRING,
            field:"comment",
            comment:'评论的内容'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'创建时间.'
        }
    },
    {
        freezeTableName: true,
        timestamps:false,
        tableName:'articleComment'
    }
);
exports.ArticleComment = ArticleComment;