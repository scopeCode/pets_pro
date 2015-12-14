/**
 * Created by scj-mo on 2015/12/15.
 */
var models      =   require('../pmodels');

var ArticleFile             =   models.ArticleFile;
/**
 *
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
 * 批量插入 标签
 * @param files
 * @param callback
 */
exports.batchCreateArticleFile   =   function(files,callback){
    ArticleFile.bulkCreate(files).then(callback);
};