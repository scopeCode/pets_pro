/**
 * 文章基本信息表
 * Created by scj-mo on 2015/12/8.
 */
var mysqlCient   =   require("./index");
var Article = mysqlCient.sequelize.define('T_B_ARTICLE',
    {
        id : {
            type : mysqlCient.Sequelize.BIGINT,
            autoIncrement : true,
            primaryKey : true,
            unique : true,
            field:'ID',
            comment:'主键,自动增长 bigint 长整形'
        },
        title:{
            type:mysqlCient.Sequelize.STRING,
            field:"TITLE",
            comment:'文章的标题.'
        },
        content:{
            type:mysqlCient.Sequelize.STRING,
            field:"CONTENT",
            comment:'文章的内容'
        },
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"TYPE",
            comment:'文章的类型 1:文字2：图片3：链接4：视频'
        },
        status:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"STATUS",
            defaultValue:true,
            comment:'文章的状态.'
        },
        created:
        {
            type:mysqlCient.Sequelize.DATE,
            field:"CREATED",
            defaultValue: mysqlCient.Sequelize.NOW,
            comment:'创建时间'
        }
    },
    {
        freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
        timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'T_B_ARTICLE'     //自定义表名
    }
);
exports.Article = Article;

/*
var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var ArticleSchema  =   new Schema({
    TITLE       :   {type   :   String                              },      //文章的标题
    CONTENT     :   {type   :   String                              },      //文章的内容
    TYPE        :   {type   :   Number                              },      //文章的类型 1:文字2：图片3：链接4：视频
    STATUS      :   {type   :   Boolean     ,default  :    true     },      //文章的状态

    CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
});

mongoose.model('Article',ArticleSchema);*/