/**
 * 用户信息表
 * Created by scj-mo on 2015/12/6.
 */
var mysqlCient   =   require("./index");
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
exports.UserInfo = UserInfo;


/*
var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var UserInfoSchema  =   new Schema({
    USER_ID             :   {type   :   ObjectId                            },      //用户表的ID
    NICK                :   {type   :   String                              },      //用户的昵称  默认为： 用户+手机号后4位
    SEX                 :   {type   :   Number  ,default    :   0           },      //性别 0 保密  1 男 2 女
    EMAIL               :   {type   :   String  ,default    :   ''          },      //邮箱信息  为了能找回密码
    BIRTH               :   {type   :   Date    ,default    :   null        },      //用户的生日
    SIGN                :   {type   :   String  ,default    :   ''          },      //个性签名
    PHOTO               :   {type   :   String  ,default    :   ''          },      //用户的头像 七牛的HASH码
    IS_PUBLISH_TEXT     :   {type   :   Boolean ,default    :   false       },      //是否发表过 文字类型的文章
    IS_PUBLISH_PHOTO    :   {type   :   Boolean ,default    :   false       },      //是否发表过 图片类型的文章
    IS_PUBLISH_LINK     :   {type   :   Boolean ,default    :   false       },      //是否发表过 链接类型的文章
    IS_PUBLISH_VIDEO    :   {type   :   Boolean ,default    :   false       },      //是否发表过 视频类型的文章
    IS_COMMENT          :   {type   :   Boolean ,default    :   false       },      //是否被评论 视频类型的文章
    IS_HOT              :   {type   :   Boolean ,default    :   false       },      //是否被点赞 视频类型的文章
    IS_TRANS            :   {type   :   Boolean ,default    :   false       },      //是否被转发 视频类型的文章
    IS_ALLOW_COMMENT    :   {type   :   Boolean ,default    :   true        },      //是否允许评论
    CREATED             :   {type   :   Date    ,default    :   Date.now    }       //创建时间
});
mongoose.model('UserInfo',UserInfoSchema);*/