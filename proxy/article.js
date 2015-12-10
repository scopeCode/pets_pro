/**
 * 文章信息处理
 * Created by scj-mo on 2015/12/10.
 */
var models      =   require('../pmodels');

exports.Article            =   models.Article;
exports.ArticleUser        =   models.ArticleUser;
exports.ArticleFile        =   models.ArticleFile;



exports.createArticle          =   function(title,content,type){

};

exports.createArticleUser      =   function(articleId,userId,type){

};


exports.createArticleFile      =   function(articleId,FILE_HASH){

};