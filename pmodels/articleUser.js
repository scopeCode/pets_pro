/**
 * 文章与用户的关系表
 * Created by scj-mo on 2015/12/8.
 */
var mysqlCient   =   require("./index");
var ArticleUser = mysqlCient.sequelize.define('T_B_ARTICLE_USER',
    {
        id : {
            type : mysqlCient.Sequelize.BIGINT,
            autoIncrement : true,
            primaryKey : true,
            unique : true,
            field:'ID',
            comment:'主键,自动增长 bigint 长整形'
        },
        articleId:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"ARTICLE_ID",
            comment:'文章表的ID'
        },
        userId:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"USER_ID",
            comment:'用户的ID'
        },
        creator:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"CREATOR",
            comment:'文章的创建者'
        },
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"TYPE",
            comment:'文章类型 0：自创 1:转载'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"STATUS",
            defaultValue: true,
            comment:'文件的状态'
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
        tableName:'T_B_ARTICLE_USER'    //自定义表名
    }
);
exports.ArticleUser = ArticleUser;



/*
var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var ArticleUserSchema  =   new Schema({
    ARTICLE_ID  :   {type   :   ObjectId    ,ref: 'Article'         },      //文章表的主键
    USER_ID     :   {type   :   ObjectId    ,ref: 'UserInfo'        },      //文章对应的用户表
    TYPE        :   {type   :   Number      ,default  :    0        },      //文章属性 0：自创 1:转载
    STATUS      :   {type   :   Boolean     ,default  :    true     },      //文件的状态
    CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
});
mongoose.model('ArticleUser',ArticleUserSchema);*/