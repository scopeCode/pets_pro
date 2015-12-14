/**
 * 文章标签表
 * Created by WG on 2015/12/12.
 */
var mysqlCient   =   require("./index");
var ArticleTag = mysqlCient.sequelize.define('T_B_ARTICLE_TAG',
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
        tagName:{
            type:mysqlCient.Sequelize.STRING,
            field:"TAG_NAME",
            comment:'标签名称'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"STATUS",
            defaultValue: true,
            comment:'用户的初始状态'
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
        tableName:'T_B_ARTICLE_TAG'    //自定义表名
    }
);
exports.ArticleTag = ArticleTag;

    /*
    var mongoose        =   require('mongoose');
    var Schema          = mongoose.Schema;
    var ObjectId        = Schema.ObjectId;

    var ArticleTagSchema  =   new Schema({
        ARTICLE_ID  :   {type   :   ObjectId                            },      //文章表的主键
        TAG_NAME    :   {type   :   String                              },      //标签名称
        STATUS      :   {type   :   Boolean     ,default  :    true     },      //标签的状态
        CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
    });

    mongoose.model('ArticleTag',ArticleTagSchema);
    */