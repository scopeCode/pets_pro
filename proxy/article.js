/**
 * 文章信息处理
 * Created by scj-mo on 2015/12/10.
 */
var EventProxy = require('eventproxy');
var models      =   require('../pmodels/models');
var sequelize   =   require('../pmodels/index').sequelize;

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
exports.createArticle          =   function(article,tags,files,userId,callback){
    var title   = article.title;
    var content = article.content;
    var type    = article.type;//默认为自创的文章

    return sequelize.transaction(function (t) {

        return User.findById(userId,{transaction: t}).then(function(user){

            return user.createArticle({
                'title' : title,
                'content':content,
                'type'  : type
            },{
                'creator':userId,
                'type':0
            },{transaction: t}).then(function (article) {
                //文章的tags处理
                var tagsLen = tags.length;
                if(tagsLen > 0){
                    for(var i=0;i<tagsLen;i++){
                        var item = tags[i];
                        (function(item){
                            article.createTag({
                                'tagName':item
                            });
                        })(item);
                    }
                }
                //文章files的处理
                var filesLen = files.length;
                if(filesLen > 0){
                    for(var i=0;i<filesLen;i++){
                        var item = files[i];
                        (function(item){
                            article.createFile({
                                'fileHash':item
                            });
                        })(item);
                    }
                }
            });
        });
    }).then(function (result) {
        callback(result);
    }).catch(function (err) {
        console.error(err);
    });
};

/**
 * 文章增加热度
 * @param req
 * @param res
 * @param next
 */
exports.articleAddHot   =   function(articleId,userId,nick,callback){
    return sequelize.transaction(function (t) {
        return Article.findById(articleId,{transaction: t}).then(function(article){
            var cnt = parseInt(article.count) + 1;
            return article.update({
                count:cnt
            },{transaction: t}).then(function(){
                //插入日志
                return article.createHot({
                    userId:userId
                },{transaction: t}).then(function(){
                    return article.createLog({
                            type:1,
                            userId:userId,
                            content:nick+'点赞咯.'
                    },{transaction: t})
                });
            });
        });
    }).then(function (result) {
        callback(result);
    }).catch(function (err) {
        console.error(err);
    });
}
/**
 * 文章减去热度
 * @param req
 * @param res
 * @param next
 */
exports.articleDescHot  =   function(articleId,userId,callback){
    return sequelize.transaction(function (t) {
        return Article.findById(articleId,{
            'include': [
                {
                    'model': Hot
                },
                {
                    'model': Log
                }
            ]
        },{transaction: t}).then(function(article){
            var cnt = parseInt(article.count) - 1;
            return article.update({
                count:cnt
            },{transaction: t}).then(function(data){

                return data.getHots({
                    articleId:articleId,
                    userId  :userId
                },{transaction: t}).then(function(obj){
                    article.removeHot(obj);
                    return article.getLogs({
                        articleId:article.id
                    },{transaction: t}).then(function(_articleLog){
                        article.removeLog(_articleLog);
                    });
                });
            });
        });
    }).then(function (result) {
        callback(result);
    }).catch(function (err) {
        console.error(err);
    });
};

/**
 * 文章被转载了
 * @param userId
 * @param article
 * @param callback
 */
exports.articleReprint  =   function(articleId,userId,callback){
    return sequelize.transaction(function (t) {
        return Article.findById(articleId,{transaction: t}).then(function(article){
            return User.findById(userId,{transaction: t}).then(function(user){
                return article.addUser(user,{transaction: t});
            });
        });
    }).then(function (result) {
        callback(result);
    }).catch(function (err) {
        console.error(err);
    });
};

//------------------------------------------------------------------------------------//
/**
 * 根据Uid查询属于他的文章信息
 * @param userId
 * @param callback
 */
exports.queryArticleList       =   function(userId,_offset,_limit,callback){
    _offset = _offset * _limit;
    var proxy = new EventProxy();


    Article.findAll({
        'include': [
            {
                'model': Tag
            },
            {
                'model': File
            },
            {
                'model': Hot
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
        offset: _offset,
        limit: _limit,
        order:' created desc ',
    }).then(function(artiles){

        var artilesLen = artiles.length;
        if(!artilesLen || artilesLen == 0){

            callback([]);

        }else{

            proxy.after('result', artilesLen , function (artiles) {
                callback(artiles);
            });


            for(var j=0;j<artilesLen;j++){
                var item = artiles[j];
                (function(artile){
                    var articleUser = artile.users[0].articleUser;

                    artile.isShowCancleFollow   =   false;     //是否显示取消关注的按钮
                    artile.isShowReprint        =   false;     //是否显示 转发类的按钮
                    artile.isShowHot            =   false;     //显示 已经有热度还是没有热度
                    artile.isActiveHot          =   false;     //显示 已经有热度还是没有热度

                    if(articleUser.creator != articleUser.userId){

                        //处理下是否显示 取消关注的按钮 条件是 type = 2    0:自创,1:转载,2:关注文章
                        artile.isShowReprint        =   true;

                        if(articleUser.type +'' == '2'){
                            artile.isShowCancleFollow = true;

                        }
                        if(articleUser.type +'' == '1'){
                            artile.isShowReprint = false;
                        }

                        artile.isShowHot       =   true;

                        var artileHotArr = artile.hots;
                        var hotLen = artileHotArr.length;

                        for(var  j=0;j<hotLen;j++){
                            var _userId = artileHotArr[j].userId;
                            if(_userId == articleUser.userId){
                                artile.isActiveHot     =   true;
                                break;
                            }
                        }

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

        }

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
