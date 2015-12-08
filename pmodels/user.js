/**
 * 用户信息模型
 * Created by scj-mo on 2015/12/6.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema  = new Schema({
    USER_NAME       :   {type   :   String                              },      //用户名
    USER_PWD        :   {type   :   String                              },      //用户密码
    REGISTER_IP     :   {type   :   String                              },      //注册IP
    REGISTER_TIME   :   {type   :   Date    ,default    :   Date.now    },      //创建时间
    REGISTER_EMAIL  :   {type   :   String  ,default    :   ''          },      //注册邮箱 ，后期可是进行补填写
    /*2015-12-08  新增加字段*/
    STATUS          :   {type   :   Boolean ,default    :   true        },      //用户的状态 true 正常 false 禁用 不可登录系统，不可评论

});

mongoose.model('User',UserSchema);      //将UserSchema 添加到  mongoose模型中