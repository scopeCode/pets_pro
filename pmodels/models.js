/**
 * 全部模型的定义  ——  需要优化 进行 拆分成 单个文件进行存储
 * Created by scj-mo on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');

var User = mysqlCient.sequelize.define('user',
    {
        userName:{
            type:mysqlCient.Sequelize.STRING,
            field:"userName",
            comment:'登录的用户名,手机号,数据库提供默认的正则的验证.',
            validate:{
                is:/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
            }
        },
        userPwd:{
            type:mysqlCient.Sequelize.STRING,
            field:"userPwd",
            comment:'登录密码,MD5加密'
        },
        ip:{
            type:mysqlCient.Sequelize.STRING,
            field:"ip",
            comment:'注册的IP地址,默认是 REQ 获得的数据'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'注册的时间,注意是否是需要进行时区的设定.'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'用户的初始状态'
        }
    },
    {
        freezeTableName: true,  //冻结表名_使用自己设定的表名进行定义
        timestamps:false,       //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'user'    //自定义表名
    }
);

var Info = mysqlCient.sequelize.define('info',
    {
        userNick:{
            type:mysqlCient.Sequelize.STRING,
            field:"userNick",
            comment:'用户的昵称'
        },
        sex:{
            type:mysqlCient.Sequelize.INTEGER,  //0 未知  1 男 2 女
            field:"sex",
            comment:'性别',
            defaultValue:0
        },
        birth:{
            type:mysqlCient.Sequelize.DATE,
            field:"birth",
            comment:'用户的出生日期',
            defaultValue:null
        },
        photo:{
            type:mysqlCient.Sequelize.STRING,
            field:"photo",
            comment:'用户的头像信息,除非特殊情况,一般都是hash码',
            defaultValue:''
        },
        bgPhoto:{
            type:mysqlCient.Sequelize.STRING,
            field:"bgPhoto",
            comment:'用户的背景,除非特殊情况,一般都是hash码',
            defaultValue:''
        },
        sign:{
            type:mysqlCient.Sequelize.STRING,
            field:"sign",
            comment:'个性签名',
            defaultValue:''
        },
        isPublishText:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isPublishText",
            comment:'是否发表过 文字类型的文章',
            defaultValue:false
        },
        isPublishPhoto:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isPublishPhoto",
            comment:'是否发表过 图片类型的文章',
            defaultValue:false
        },
        isPublishLink:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isPublishLink",
            comment:'是否发表过 链接类型的文章',
            defaultValue:false
        },
        isPublishVideo:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isPublishVideo",
            comment:'是否发表过 视频类型的文章',
            defaultValue:false
        },
        isComment:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isComment",
            comment:'是否被评论 视频类型的文章',
            defaultValue:false
        },
        isHot:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isHot",
            comment:'是否被点赞 视频类型的文章',
            defaultValue:false
        },
        isTrans:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isTrans",
            comment:'是否被转发 视频类型的文章',
            defaultValue:false
        },
        isAllowComment:{
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"isAllowComment",
            comment:'是否允许评论',
            defaultValue:false
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
        tableName:'info'    //自定义表名
    }
);

/*var UserInfo = mysqlCient.sequelize.define('userInfo',
 {
 status:
 {
 type:mysqlCient.Sequelize.BOOLEAN,
 field:"status",
 defaultValue: true,
 comment:'关系的状态'
 }
 },
 {
 freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
 timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
 tableName:'userInfo' //自定义表名
 });*/


var Article = mysqlCient.sequelize.define('article',
    {
        title:{
            type:mysqlCient.Sequelize.STRING,
            field:"title",
            comment:'文章的标题.'
        },
        content:{
            type:mysqlCient.Sequelize.STRING,
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

var ArticleFile = mysqlCient.sequelize.define('articleFile',
    {
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'关系的状态'
        }
    },
    {
        freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
        timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'articleFile' //自定义表名
    });

var Tag = mysqlCient.sequelize.define('tag',
    {
        tagName:{
            type:mysqlCient.Sequelize.STRING,
            field:"tagName",
            comment:'标签名称'
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
        tableName:'tag'    //自定义表名
    }
);

var ArticleTag = mysqlCient.sequelize.define('articleTag',
    {
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'关系的状态'
        }
    },
    {
        freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
        timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'articleTag' //自定义表名
    });

var Log = mysqlCient.sequelize.define('log',
    {
        type:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"type",
            comment:'类型操作符  1:热度 2:评论  3：转发'
        },
        content:{
            type:mysqlCient.Sequelize.STRING,
            field:"content",
            comment:'文章日志的内容'
        },
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'状态'
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
        tableName:'log'    //自定义表名
    }
);

var ArticleLog = mysqlCient.sequelize.define('articleLog',
    {
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'关系的状态'
        }
    },
    {
        freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
        timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'articleLog' //自定义表名
    });


var Hot = mysqlCient.sequelize.define('hot',
    {
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'状态'
        },
        created:{
            type:mysqlCient.Sequelize.DATE,
            field:"created",
            defaultValue:mysqlCient.Sequelize.NOW,
            comment:'创建时间.'
        }
    },
    {
        freezeTableName: true,          //冻结表名_使用自己设定的表名进行定义
        timestamps:false,               //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'hot'             //自定义表名
    }
);


var ArticleHot = mysqlCient.sequelize.define('articleHot',
    {
        status:
        {
            type:mysqlCient.Sequelize.BOOLEAN,
            field:"status",
            defaultValue: true,
            comment:'关系的状态'
        }
    },
    {
        freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
        timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
        tableName:'articleHot' //自定义表名
    });

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

exports.User        =   User;
exports.Info        =   Info;
exports.Article     =   Article;
exports.File        =   File;
exports.Tag         =   Tag;
exports.Log         =   Log;
exports.Hot         =   Hot;

User.hasOne(Info);
Info.belongsTo(User);

Article.belongsToMany(File, {'through': ArticleFile});
File.belongsToMany(Article, {'through': ArticleFile});

Article.belongsToMany(Tag, {'through': ArticleTag});
Tag.belongsToMany(Article, {'through': ArticleTag});


Article.belongsToMany(Log, {'through': ArticleLog});
Log.belongsToMany(Article, {'through': ArticleLog});

Article.belongsToMany(Hot, {'through': ArticleHot});
Hot.belongsToMany(Article, {'through': ArticleHot});

Article.belongsToMany(User,{'through': ArticleUser});
User.belongsToMany(Article,{'through': ArticleUser});



/*
User.sync({force: true}).then(function () {});
Info.sync({force: true}).then(function () {});
Article.sync({force: true}).then(function () {});
File.sync({force: true}).then(function () {});
Tag.sync({force: true}).then(function () {});
Log.sync({force: true}).then(function () {});
Hot.sync({force: true}).then(function () {});

ArticleTag.sync({force: true}).then(function () {});
ArticleFile.sync({force: true}).then(function () {});
ArticleLog.sync({force: true}).then(function () {});
ArticleHot.sync({force: true}).then(function () {});
ArticleUser.sync({force: true}).then(function () {});*/