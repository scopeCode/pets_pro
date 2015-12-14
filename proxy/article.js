/**
 * 文章信息处理
 * Created by scj-mo on 2015/12/10.
 */
var models      =   require('../pmodels');

var Article             =   models.Article;
var ArticleUser         =   models.ArticleUser;
var ArticleFile         =   models.ArticleFile;

/**
 * 创建文章表
 * @param title
 * @param content
 * @param type
 * @param callback
 */
exports.createArticle          =   function(title,content,type,callback){
    Article.create({
        title   :title,
        content :content,
        type    :type
    }).then(callback);
};

/**
 * 创建文章对应用户表
 * @param articleId
 * @param userId
 * @param type
 * @param callback
 */
exports.createArticleUser      =   function(articleId,userId,type,callback){
    ArticleUser.create({
        articleId:articleId,
        userId:userId,
        type:type
    }).then(callback);
};

/**
 * 创建文章对应文件表
 * @param articleId
 * @param fileHash
 * @param callback
 */
exports.createArticleFile      =   function(articleId,fileHash,callback){
    ArticleFile.create({
        articleId:articleId,
        fileHash:fileHash
    }).then(callback);
};

/**
 * 根据用户ID获取用户的信息
 * @param limit
 * @param pageNo
 * @param userId
 * @param callback
 */
exports.getArticleUserListByUid     =    function(limit,pageNo,userId,callback){
    Article.find({
        'where':{
            'USER_ID' : userId
        },
        'order': [
            ['CREATED', 'DESC']
        ]
    });
}