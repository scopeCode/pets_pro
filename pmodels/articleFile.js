/**
 * 文章对应的文件表
 * Created by scj-mo on 2015/12/8.
 */
var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var ArticleFileSchema  =   new Schema({
    ARTICLE_ID  :   {type   :   ObjectId                            },      //文章表的主键
    FILE_HASH   :   {type   :   String                              },      //七牛的文件HASH码
    STATUS      :   {type   :   Boolean     ,default  :    true     },      //文件的状态
    CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
});

mongoose.model('ArticleFile',ArticleFileSchema);