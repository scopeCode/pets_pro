/**
 * 文章基本信息表
 * Created by scj-mo on 2015/12/8.
 */
var mysqlCient   =   require("./index");


var User = mysqlCient.sequelize.define('T_B_USER',
    {
        id : {
            type : mysqlCient.Sequelize.BIGINT,
            autoIncrement : true,
            primaryKey : true,
            unique : true,
            field:'ID',
            comment:'主键,自动增长 bigint 长整形'
        },
        userName:{
            type:mysqlCient.Sequelize.STRING,
            field:"USER_NAME",
            comment:'登录的用户名,手机号,数据库提供默认的正则的验证.',
            validate:{
                is:/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
            }
        },
        userPwd:{
            type:mysqlCient.Sequelize.STRING,
            field:"USER_PWD",
            comment:'登录密码,MD5加密'
        },
        registerIp:{
            type:mysqlCient.Sequelize.STRING,
            field:"REGISTER_IP",
            comment:'注册的IP地址,默认是 REQ 获得的数据'
        },
        registerTime:{
            type:mysqlCient.Sequelize.DATE,
            field:"REGISTER_TIME",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'注册的时间,注意是否是需要进行时区的设定.'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"STATUS",
            defaultValue: true,
            comment:'用户的初始状态'
        }
    },
    {
        freezeTableName: true,  //冻结表名_使用自己设定的表名进行定义
        timestamps:false,       //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'T_B_USER'    //自定义表名
    }
);

var UserInfo = mysqlCient.sequelize.define('T_B_USER_EX',
    {
        id:{
            type : mysqlCient.Sequelize.BIGINT,
            autoIncrement : true,
            primaryKey : true,
            unique : true,
            field:'ID',
            comment:'主键,自动增长 bigint 长整形'
        },
        userId:{
            type:mysqlCient.Sequelize.BIGINT,
            field:"USER_ID",
            comment:'用户表的主键ID'
        },
        userNick:{
            type:mysqlCient.Sequelize.STRING,
            field:"NICK",
            comment:'用户的昵称'
        },
        sex:{
            type:mysqlCient.Sequelize.INTEGER,  //0 未知  1 男 2 女
            field:"SEX",
            comment:'系统表中性别的ID',
            defaultValue:0
        },
        birth:{
            type:mysqlCient.Sequelize.DATE,
            field:"BIRTH",
            comment:'用户的出生日期',
            defaultValue:null
        },
        photo:{
            type:mysqlCient.Sequelize.STRING,
            field:"PHOTO",
            comment:'用户的头像信息,除非特殊情况,一般都是hash码',
            defaultValue:''
        },
        bgPhoto:{
            type:mysqlCient.Sequelize.STRING,
            field:"BG_PHOTO",
            comment:'用户的背景,除非特殊情况,一般都是hash码',
            defaultValue:''
        },
        sign:{
            type:mysqlCient.Sequelize.STRING,
            field:"SIGN",
            comment:'个性签名',
            defaultValue:''
        },
        isPublishText:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_PUBLISH_TEXT",
            comment:'是否发表过 文字类型的文章',
            defaultValue:false
        },
        isPublishPhoto:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_PUBLISH_PHOTO",
            comment:'是否发表过 图片类型的文章',
            defaultValue:false
        },
        isPublishLink:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_PUBLISH_LINK",
            comment:'是否发表过 链接类型的文章',
            defaultValue:false
        },
        isPublishVideo:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_PUBLISH_VIDEO",
            comment:'是否发表过 视频类型的文章',
            defaultValue:false
        },
        isComment:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_COMMENT",
            comment:'是否被评论 视频类型的文章',
            defaultValue:false
        },
        isHot:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_HOT",
            comment:'是否被点赞 视频类型的文章',
            defaultValue:false
        },
        isTrans:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_TRANS",
            comment:'是否被转发 视频类型的文章',
            defaultValue:false
        },
        isAllowComment:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"IS_ALLOW_COMMENT",
            comment:'是否允许评论',
            defaultValue:false
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
        tableName:'T_B_USER_EX'    //自定义表名
    }
);

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
        count:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"HOT_COUNT",
            defaultValue:0,
            comment:'文章的热度值'
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

var ArticleLog = mysqlCient.sequelize.define('T_B_ARTICLE_LOG',
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
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"TYPE",
            comment:'类型操作符  1:热度 2:评论  3：转发'
        },
        content:{
            type:mysqlCient.Sequelize.STRING,
            field:"CONTENT",
            comment:'文章日志的内容'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"STATUS",
            defaultValue: true,
            comment:'状态'
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
        tableName:'T_B_ARTICLE_LOG'    //自定义表名
    }
);


var ArticleHot = mysqlCient.sequelize.define('T_B_ARTICLE_HOT',
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
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"STATUS",
            defaultValue: true,
            comment:'状态'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"CREATED",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'创建时间.'
        }
    },
    {
        freezeTableName: true,          //冻结表名_使用自己设定的表名进行定义
        timestamps:false,               //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'T_B_ARTICLE_HOT'     //自定义表名
    }
);

exports.User        =   User;
exports.UserInfo    =   UserInfo;
exports.Article     =   Article;
exports.ArticleFile =   ArticleFile;
exports.ArticleTag  =   ArticleTag;
exports.ArticleUser =   ArticleUser;
exports.ArticleLog  =   ArticleLog;
exports.ArticleHot  =   ArticleHot;


User.hasOne(UserInfo,               {as: 'UserInfo',foreignKey:'USER_ID'});
UserInfo.belongsTo(User,            {as: 'User',foreignKey:'USER_ID'});


Article.hasMany(ArticleFile,        {as: 'ArticleFile',foreignKey:'ARTICLE_ID'});
ArticleFile.belongsToMany(Article,  {as: 'Article',through:'ARTICLE_ID'});

Article.hasOne(ArticleUser,         {as: 'ArticleUser',foreignKey:'ARTICLE_ID'});
ArticleUser.belongsTo(Article,      {as: 'Article',foreignKey:'ARTICLE_ID'});

User.hasMany(ArticleUser,           {as: 'ArticleUser',foreignKey:'USER_ID'});
ArticleUser.belongsToMany(User,     {as: 'UserInfo',through:'USER_ID'});

Article.hasMany(ArticleTag,         {as: 'ArticleTag',foreignKey:'ARTICLE_ID'});
ArticleTag.belongsToMany(Article,   {as: 'Article',through:'ARTICLE_ID'});

Article.hasMany(ArticleLog,         {as: 'ArticleLog',foreignKey:'ARTICLE_ID'});
ArticleLog.belongsToMany(Article,   {as: 'Article',through:'ARTICLE_ID'});

Article.hasMany(ArticleHot,         {as: 'ArticleHot',foreignKey:'ARTICLE_ID'});
ArticleHot.belongsToMany(Article,   {as: 'Article',through:'ARTICLE_ID'});