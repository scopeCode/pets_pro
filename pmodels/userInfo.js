/**
 * 用户信息表
 * Created by scj-mo on 2015/12/6.
 */

var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var UserInfoSchema  =   new Schema({
    USER_ID             :   {type   :   ObjectId                            },      //用户表的ID
    NICK                :   {type   :   String                              },      //用户的昵称  默认为： 用户+手机号后4位
    SEX                 :   {type   :   Number  ,default    :   0           },      //性别 0 保密  1 男 2 女
    EMAIL               :   {type   :   String  ,default    :   ''          },      //邮箱信息  为了能找回密码
    BIRTH               :   {type   :   Date    ,default    :   null        },      //用户的生日
    /*2015-12-08  完善数据库字段*/
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

mongoose.model('UserInfo',UserInfoSchema);