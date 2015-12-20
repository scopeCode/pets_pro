/**
 * 文章信息处理
 * Created by scj-mo on 2015/12/10.
 */
var models      =   require('../pmodels');

var Article             =   models.Article;
var ArticleUser         =   models.ArticleUser;
var ArticleFile         =   models.ArticleFile;
var ArticleTag          =   models.ArticleTag;
var ArticleLog          =   models.ArticleLog;
var ArticleHot          =   models.ArticleHot;
var UserInfo            =   models.UserInfo;
var User                =   models.User;

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
exports.queryArticleList       =   function(userId,callback){
    Article.findAll(
        {
            include:[
                {
                    model:ArticleUser,
                    as:'ArticleUser',
                    where:{
                        'USER_ID':userId
                    }
                },
                {
                    model:ArticleFile,
                    as:'ArticleFile'
                },
                {
                    model:ArticleTag,
                    as:'ArticleTag'
                }
                ,
                {
                    model:ArticleHot,
                    as:'ArticleHot'
                }
            ],
            order:"`T_B_ARTICLE`.`CREATED` DESC"
        }

    ).then(function(data){
            callback(data);
        });

};

/**
 * 利用sql进行查询文件信息 并整理对应的关系
 * @param articleId
 * @param callback
 */
exports.queryArticleListEx     = function(userId,limit,pageSize,callback){
    var sql = [];
    sql.push('SELECT ');
    sql.push('	a.id as aId,a.TITLE as aTitle,a.CONTENT as aContent,a.CREATED as aCreated,a.HOT_COUNT as aHotCount,a.TYPE as aType,');
    sql.push('	u.ARTICLE_ID as uArticleId,u.CREATOR as uCreator,u.USER_ID as uUserId,u.TYPE as uType, ');
    sql.push('  f.ARTICLE_ID as fArticleId,f.FILE_HASH as fFileHash,');
    sql.push('  t.ARTICLE_ID as tArticleId,t.TAG_NAME as tTagName,');
    sql.push('  h.ARTICLE_ID as hArticleId,h.USER_ID as  hUserId,');
    sql.push('  e.BG_PHOTO   as eBgPhoto,e.NICK as eNick,e.PHOTO as ePhoto,e.SIGN as eSign');
    sql.push(' FROM t_b_article  a');
    sql.push('	LEFT JOIN t_b_article_user u on u.ARTICLE_ID = a.ID ');
    sql.push('	LEFT JOIN t_b_article_file f on f.ARTICLE_ID = a.ID ');
    sql.push('	LEFT JOIN t_b_article_tag  t on t.ARTICLE_ID = a.ID ');
    sql.push('	LEFT JOIN t_b_article_hot  h on h.ARTICLE_ID = a.ID ');
    sql.push('	LEFT JOIN t_b_user_ex      e on e.USER_ID    = u.CREATOR  ');
    sql.push('  WHERE u.USER_ID =  ' + userId );
    sql.push('  ORDER BY a.CREATED desc;');

    models.sequelize.query(sql.join('')).spread(function(results, metadata) {

        var temp =[];
        var len = metadata.length;

        var articleList = [];

        var tempObj = {
            base:{},
            tags:[],
            files:[],
            user:{},
            hot:false,
            isHot:false,    //是否可以加热
            isTrans:false   //是否可以转发
        };

        for(var i=0;i<len;i++){
            var item = metadata[i];

            var id          =   item.aId;
            var title       =   item.aTitle;
            var content     =   item.aContent;
            var created     =   item.aCreated;
            var hotCount    =   item.aHotCount;
            var type        =   item.aType;
            var creator     =   item.uCreator;
            var userId      =   item.uUserId;
            var utype       =   item.uType;//自创 转发

            var fileHash    =   item.fFileHash;
            var tagName     =   item.tTagName;

            var bgPhoto     =   item.eBgPhoto;
            var nick        =   item.eNick;
            var photo       =   item.ePhoto;
            var sign        =   item.eSign;

            var hUserId     =   item.hUserId;

            //用户信息
            if(!temp[id]){//没有

                if(tempObj.base.id){
                    articleList.push(tempObj);
                }

                tempObj = {
                    base:{},
                    tags:[],
                    files:[],
                    user:{},
                    hot:false,
                    isHot:false,    //是否可以加热
                    isTrans:false   //是否可以转发
                };

                tempObj.base.id          =   id;
                tempObj.base.title       =   title;
                tempObj.base.content     =   content;
                tempObj.base.created     =   created;
                tempObj.base.hotCount    =   hotCount;
                tempObj.base.type        =   type;
                tempObj.base.creator     =   creator;
                tempObj.base.userId      =   userId;

                tempObj.user.bgPhoto     =   bgPhoto;
                tempObj.user.nick        =   nick;
                tempObj.user.photo       =   photo;
                tempObj.user.sign        =   sign;

                if(tagName){
                    tempObj.tags.push({tagName:tagName});
                }
                if(fileHash){
                    tempObj.files.push({fileHash:fileHash});
                }

                if(creator != userId){
                    if(hUserId){
                        tempObj.hot = true;
                    }
                    tempObj.isHot = true;
                    tempObj.isTrans = true;
                }
                temp[id] = id;

            }else{
                if(tagName){
                    tempObj.tags.push({tagName:tagName});
                }
                if(fileHash){
                    tempObj.files.push({fileHash:fileHash});
                }
            }
        }

        //兜底
        if(tempObj.base.id){
            articleList.push(tempObj);
        }

        callback(articleList);
    });
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
