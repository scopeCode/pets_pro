/**
 * 文章与用户的关系表
 * Created by scj-mo on 2015/12/8.
 */
var mongoose        =   require('mongoose');
var Schema          = mongoose.Schema;
var ObjectId        = Schema.ObjectId;

var ArticleUserSchema  =   new Schema({
    ARTICLE_ID  :   {type   :   ObjectId                            },      //文章表的主键
    USER_ID     :   {type   :   ObjectId                            },      //文章对应的用户表
    TYPE        :   {type   :   Number      ,default  :    0        },      //文章属性 0：自创 1:转载
    STATUS      :   {type   :   Boolean     ,default  :    true     },      //文件的状态
    /*2015-12-12    新增加联表查找对外字段*/
    ARTICLES    :   {type   :   ObjectId    ,ref: 'Article'         },
    CREATED     :   {type   :   Date        ,default  :    Date.now }       //创建时间
});

mongoose.model('ArticleUser',ArticleUserSchema);