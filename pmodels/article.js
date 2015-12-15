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

var ArticleFile = mysqlCient.sequelize.define('T_B_ARTICLE_FILE',
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
        fileHash:{
            type:mysqlCient.Sequelize.STRING,
            field:"FILE_HASH",
            comment:'文章对应的 hash 码'
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
        tableName:'T_B_ARTICLE_FILE'    //自定义表名
    }
);
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

exports.Article = Article;
exports.ArticleFile = ArticleFile;
exports.ArticleTag = ArticleTag;
exports.ArticleUser = ArticleUser;

ArticleUser.hasMany(ArticleFile,    {as: 'ArticleFile',foreignKey:'ARTICLE_ID'});
ArticleUser.hasMany(ArticleTag,     {as: 'ArticleFile',foreignKey:'ARTICLE_ID'});
Article.hasMany(ArticleUser,        {as: 'ArticleFile',foreignKey:'ARTICLE_ID'});

ArticleFile.belongsTo(ArticleUser,  {as: 'Article',foreignKey:'ARTICLE_ID'});
ArticleTag.belongsTo(ArticleUser,   {as: 'Article',foreignKey:'ARTICLE_ID'});
ArticleUser.belongsTo(Article,  {as: 'Article',foreignKey:'ARTICLE_ID'});