/**
 * 文章基本信息表
 * Created by scj-mo on 2015/12/8.
 */
var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var ArticleSchema  =   new Schema({
    TITLE       :   {type   :   String                              },      //文章的标题
    CONTENT     :   {type   :   String                              },      //文章的内容
    TYPE        :   {type   :   Number                              },      //文章的类型 1:文字2：图片3：链接4：视频
    STATUS      :   {type   :   Boolean     ,default  :    true     },      //文章的状态
    CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
});

mongoose.model('Article',ArticleSchema);