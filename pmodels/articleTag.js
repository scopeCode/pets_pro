/**
 * 文章标签表
 * Created by WG on 2015/12/12.
 */

var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var ArticleTagSchema  =   new Schema({
    ARTICLE_ID  :   {type   :   ObjectId                            },      //文章表的主键
    TAG_NAME    :   {type   :   String                              },      //标签名称
    STATUS      :   {type   :   Boolean     ,default  :    true     },      //标签的状态
    CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
});

mongoose.model('ArticleTag',ArticleTagSchema);