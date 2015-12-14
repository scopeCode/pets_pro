/**
 * 标签系统的处理
 * Created by scj-mo on 2015/12/15.
 */
var models      =   require('../pmodels');

var ArticleTag             =   models.ArticleTag;
/**
 *
 * @param articleId
 * @param tagName
 * @param callback
 */
exports.createArticleTag      =   function(articleId,tagName,callback){
    ArticleTag.create({
        articleId:articleId,
        tagName:tagName
    }).then(callback);
};

/**
 * 批量插入 标签
 * @param tags
 * @param callback
 */
exports.batchCreateArticleTag   =   function(tags,callback){
    ArticleTag.bulkCreate(tags).then(callback);
};