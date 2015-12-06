/**
 * 用户信息表
 * Created by scj-mo on 2015/12/6.
 */

var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var UserInfoSchema  =   new Schema({
    USER_ID         :   {type   :   ObjectId    },                          //用户表的ID
    NICK            :   {type   :   String      } ,                         //用户的昵称  默认为： 用户+手机号后4位
    SEX             :   {type   :   Number  ,default    :   0        },     //性别 0 保密  1 男 2 女
    EMAIL           :   {type   :   String  ,default    :   ''       },     //邮箱信息  为了能找回密码
    BIRTH           :   {type   :   Date    ,default    :   null     },     //用户的生日
    CREATED         :   {type   :   Date    ,default    :   Date.now }      //创建时间
});

mongoose.model('UserInfo',UserInfoSchema);