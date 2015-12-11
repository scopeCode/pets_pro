/**
 * 日志模型表
 * Created by scj-mo on 2015/12/11.
 */
var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;

var LoggerSchema  =   new Schema({
    TYPE        :   {type   :   String                              },      //日志类型
    CONTENT     :   {type   :   String                              },      //日志内容
    CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
});

mongoose.model('Logger',LoggerSchema);