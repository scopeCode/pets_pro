/**
 * 文章信息处理
 * Created by scj-mo on 2015/12/10.
 */
var models      =   require('../pmodels');

var Article             =   models.Article;
var ArticleUser         =   models.ArticleUser;
var ArticleFile         =   models.ArticleFile;
var ArticleTag          =   models.ArticleTag;
var sequelize           =   models.sequelize;
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
exports.createArticleUser      =   function(articleId,userId,creator,type,callback){
    ArticleUser.create({
        articleId:articleId,
        userId:userId,
        creator:creator,
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
 * 批量插入 标签
 * @param files
 * @param callback
 */
exports.batchCreateArticleFile   =   function(files,callback){
    ArticleFile.bulkCreate(files).then(callback);
};
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

/**
 * 根据Uid查询属于他的文章信息
 * @param userId
 * @param callback
 */
exports.queryArticleList       =   function(userId,callback){

    var sql = [];
    sql.push("SELECT u.`USER_ID`,u.CREATOR,a.`TITLE`,a.`TYPE` as articleType,a.`CONTENT`,a.`CREATED`,_u.`NICK`,_u.`PHOTO`,a.ID as articleId");
    sql.push(" FROM t_b_article_user u");
    sql.push(" LEFT JOIN t_b_article      a ON a.`ID` = u.`ID`");
    sql.push(" LEFT JOIN t_b_user_ex	    _u ON _u.USER_ID = u.CREATOR ");
    sql.push(" WHERE u.USER_ID = " + userId);
    sql.push(" ORDER BY u.CREATED DESC");

    sequelize.query(sql.join(''),
        {logging : true, plain : false,  raw : true}).then(function(res){
            callback(res[0]);
    });
};

/**
 * 查询文章所属的图片文件
 * @param articleId
 * @param callback
 */
exports.querArtileFiles      = function(articleId,callback){
    ArticleFile.findAll({
        where: {
            articleId: articleId
        }
    }).then(function(data){
        callback(data);
    });
};