/**
 * 文章信息处理
 * Created by scj-mo on 2015/12/10.
 */
var EventProxy = require('eventproxy');
var models      =   require('../pmodels/models');

var Article         =   models.Article;
var File            =   models.File;
var Tag             =   models.Tag;
var Log             =   models.Log;
var Hot             =   models.Hot;
var User            =   models.User;
var Info            =   models.Info;

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

exports.updateArticleHotCnt     =   function(articleId,type,callback){

    var sql = "";
    switch (type){
        case "1":{//加1
            sql = 'UPDATE t_b_article SET HOT_COUNT = HOT_COUNT + 1 WHERE ID = '+articleId;
        }break;
        case "2":{//减1
            sql = 'UPDATE t_b_article SET HOT_COUNT = HOT_COUNT - 1 WHERE ID = '+articleId;
        }break;
    }

    models.sequelize.query(sql).spread(function(results, metadata) {
        callback(results, metadata);
    });
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

/***
 * 添加文章热度的对应关系
 * @param userId
 * @param articleId
 * @param callback
 */
exports.createArticleHot        =   function(userId,articleId,callback){
    ArticleHot.create({
        userId:userId,
        articleId:articleId
    }).then(callback);
};

/***
 * 删除文章热度的对应关系
 * @param userId
 * @param articleId
 * @param callback
 */
exports.deleteArticleHot        =   function(userId,articleId,callback){
    ArticleHot.destroy({
        where:{
            userId:userId,
            articleId:articleId
        }
    }).then(callback);
};
/**
 * 文章的操作记录表
 * @param articleId
 * @param userId
 * @param type
 * @param content
 * @param callback
 */
exports.createArticleLog        =   function(articleId,userId,type,content,callback){
    ArticleLog.create({
        articleId:articleId,
        userId:userId,
        type:type,
        content:content
    }).then(callback);
};
/**
 * 删除文章日志
 * @param articleId
 * @param userId
 * @param type
 * @param callback
 */
exports.deleteArticleLog        =   function(articleId,userId,type,callback){
    ArticleLog.destroy({
        where:{
            articleId:articleId,
            userId:userId,
            type:type
        }
    }).then(callback);
};
//------------------------------------------------------------------------------------//
/**
 * 根据Uid查询属于他的文章信息
 * @param userId
 * @param callback
 */
exports.queryArticleList       =   function(userId,limit,pageSize,callback){

    var artiles = Article.findAll({
        'include': [
            {
                'model': Tag
            },
            {
                'model': File
            },
            {
                'model': User,
                'include': [
                    {'model': Info}
                ],
                'where':{
                    'id' : userId
                }
            }
        ],
        'limit' :limit ,
        'offset':pageSize,
        'order' :' created desc ',
    });


    var proxy = new EventProxy();
    var artilesLen = artiles.length;

    if(!artilesLen || artilesLen == 0){
        callback([]);
    }

    proxy.after('result', artilesLen , function (artiles) {
        callback(artiles);
    });

    for(var j=0;j<artilesLen;j++){
        var item = artiles[j];
        (function(artile){
            var articleUser = artile.users[0].articleUser;
            if(articleUser.creator != articleUser.userId){
                User.find({
                    'include': [Info],
                    'where': {
                        'id':  articleUser.creator
                    }
                }).then(function(data){
                    artile.users[0] = data;
                    if(artilesLen - 1 == j){
                        return proxy.emit('result',artile);
                    }
                    proxy.emit('result',artile);
                });
            }else{
                proxy.emit('result',artile);
            }
        })(item);
    }

};

/**
 * 查询文章的日志记录表
 * @param articleId
 * @param callback
 */
exports.queryArticleLog     =   function(articleId,limit,pageSize,callback){
    var sql = [];
    sql.push(' SELECT log.ARTICLE_ID,log.CONTENT,log.CREATED,log.USER_ID,ex.PHOTO,ex.BG_PHOTO,ex.NICK  ');
    sql.push(' FROM t_b_article_log log ');
    sql.push(' LEFT JOIN t_b_user_ex ex on ex.USER_ID = log.USER_ID ');
    sql.push(' WHERE log.ARTICLE_ID = ' + articleId);
    sql.push(' LIMIT '+ (parseInt(limit) * parseInt(pageSize)) +','+pageSize);
    models.sequelize.query(sql.join('')).spread(function(results, metadata) {
        callback(results, metadata);
    });
};
