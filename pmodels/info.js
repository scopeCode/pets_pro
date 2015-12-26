/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');

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
        totalCnt:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"totalCnt",
            comment:'个人魅力总值',
            defaultValue:0
        },
        todayCnt:{
            type:mysqlCient.Sequelize.INTEGER,
            field:"todayCnt",
            comment:'今天魅力值',
            defaultValue:0
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
exports.Info        =   Info;