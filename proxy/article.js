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
 * 文章被转载了  新建立一片文章  但是 要知道 这篇文章 的根是谁  包括 创建者 和  文章ID
 * @param userId
 * @param article
 * @param callback
 */
exports.articleReprint  =   function(articleId,userId,callback){
    return sequelize.transaction(function (t) {

       return Article.findAll({
            'include': [
                {
                    'model': Tag
                },
                {
                    'model': File
                },
                {
                    'model': Hot
                }
            ],
            'where':{
                id:articleId
            }
        },{transaction: t}).then(function(artiles){
            var article = artiles[0];

            return User.findById(userId,{transaction: t}).then(function(user){

                return user.createArticle({
                    'title' : article.title,
                    'content':article.content,
                    'type'  : article.type
                },{
                    'creator':userId,
                    'type':1,
                    'fromArticleId':articleId
                },{transaction: t}).then(function (_article) {
                    //文章的tags处理
                    var tagsLen = article.tags.length;
                    if(tagsLen > 0){
                        for(var i=0;i<tagsLen;i++){
                            var item = article.tags[i].tagName;
                            (function(item){
                                _article.createTag({
                                    'tagName':item
                                });
                            })(item);
                        }
                    }
                    //文章files的处理
                    var filesLen = article.files.length;
                    if(filesLen > 0){
                        for(var i=0;i<filesLen;i++){
                            var item = article.files[i];
                            (function(item){
                                _article.createFile({
                                    'fileHash':item.fileHash
                                });
                            })(item);
                        }
                    }

                });
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
 * 改写 首页 读取信息的 查询方式
 * @param userId
 * @param _offset
 * @param _limit
 * @param callback
 */
exports.queryArticleListEx      =   function(userId,_offset,_limit,callback){

    _offset = _offset * _limit;
    var proxy = new EventProxy();

    User.find({
        include:[
            {
                'model' : Info
            }
        ],
        where:{
            id:userId
        }
    }).then(function(user){
        user.getArticles({
            'order' :  ' created desc ',
            'limit':_limit,
            'offset':_offset,
        }).then(function(articles){

            var len = articles.length;
            if(len>0){

                proxy.after('articleHots', len , function (articles) {
                    callback(articles);
                });

                proxy.after('articleTags', len , function (articles) {
                    for(var i=0;i<len;i++){
                        var item = articles[i];
                        (function(item,i){
                            item.article.getHots({
                                'where':{
                                    'userId':userId
                                }
                            }).then(function(hots){
                                if(hots&&hots.length>0){
                                    item.article.isActiveHot  =   true;
                                }
                                if(len - 1 == i){
                                    return proxy.emit('articleHots',item);
                                }
                                proxy.emit('articleHots',item);
                            });
                        })(item,i);
                    }
                });

                proxy.after('articleFiles', len , function (articles) {
                    for(var i=0;i<len;i++){
                        var item = articles[i];
                        (function(item,i){
                            item.article.getTags().then(function(tags){
                                var result = item;
                                if(tags.length>0){
                                    result.tags=tags;
                                }
                                if(len - 1 == i){
                                    return proxy.emit('articleTags',result);
                                }
                                proxy.emit('articleTags',result);
                            });
                        })(item,i);
                    }
                });

                proxy.after('result', len , function (articles) {
                    for(var i=0;i<len;i++){
                        var item = articles[i];
                        (function(item,i){
                            item.article.getFiles().then(function(files){
                                var result = item;
                                if(files.length>0){
                                    result.files=files;
                                }
                                if(len - 1 == i){
                                    return proxy.emit('articleFiles',result);
                                }
                                proxy.emit('articleFiles',result);
                            });
                        })(item,i);
                    }
                });

                for(var i=0;i<len;i++){
                    var item = articles[i];

                    var result = {article:item};

                    var articleUser = item.articleUser;

                    result.isShowCancleFollow   =   false;     //是否显示取消关注的按钮
                    result.isShowReprint        =   false;     //是否显示 转发类的按钮
                    result.isShowHot            =   false;     //显示 已经有热度还是没有热度
                    result.isActiveHot          =   false;     //显示 已经有热度还是没有热度

                    if(articleUser.creator != articleUser.userId){
                        //处理下是否显示 取消关注的按钮 条件是 type = 2    0:自创,1:转载,2:关注文章
                        item.isShowReprint        =   true;
                        if(articleUser.type +'' == '2'){
                            result.isShowCancleFollow = true;
                        }
                        if(articleUser.type +'' == '1'){
                            result.isShowReprint = false;
                        }
                        result.isShowHot       =   true;

                        User.find({
                            'include': [Info],
                            'where': {
                                'id':  articleUser.creator
                            }
                        }).then(function(data){

                            result.user = data;
                            if(len - 1 == j){
                                return proxy.emit('result',result);
                            }
                            proxy.emit('result',result);
                        });

                    }else{
                        result.user = user;
                        proxy.emit('result',result);
                    }
                }
            }else{
                callback([]);
            }
        });
    });


};


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

    return sequelize.transaction(function (t) {
        return Article.findById(articleId,{

        },{transaction: t}).then(function(article){

        });
    }).then(function (result) {
        callback(result);
    }).catch(function (err) {
        console.error(err);
    });
};

/**
 * 获取前3篇图片文章及对应图片信息
 * @param userId
 * @param callback
 */
exports.queryTop3Article    =   function(userId,callback){
        var proxy = new EventProxy();
        User.findById(userId).then(function(user){
            user.getArticles({
                'type':2,
                'order':' created desc ',
                'limit':3
            }).then(function(articles){
                var len = articles.length;
                if(len>0){
                    proxy.after('result', len , function (files) {
                        callback(files);
                    });
                    for(var i=0;i<len;i++){
                        var item = articles[i];
                        (function(item,i){
                            item.getFiles().then(function(files){
                                var result = {article:item};
                                if(files.length>0){
                                    result.file=files[0]
                                }
                                if(len - 1 == i){
                                    return proxy.emit('result',result);
                                }
                                proxy.emit('result',result);
                            });
                        })(item,i);
                    }
                }else{
                    callback([]);
                }
            });
        });
};


/**
 * 获取单篇 文章的信息
 * @param userId
 * @param _offset
 * @param _limit
 * @param callback
 */
exports.queryArticleById      =   function(articleId,userId,callback){

    var proxy = new EventProxy();

    Article.findById(articleId,{
        'include': [{
            'model': User,
            'include': [ {'model': Info}]
        }]
    }).then(function(article){

        var result = {article:article};

        var articleUser = article.users[0].articleUser;
        var user       =  article.users[0];

        result.isShowCancleFollow   =   false;     //是否显示取消关注的按钮
        result.isShowReprint        =   false;     //是否显示 转发类的按钮
        result.isShowHot            =   false;     //显示 已经有热度还是没有热度
        result.isActiveHot          =   false;     //显示 已经有热度还是没有热度


        proxy.after('articleHots', 1 , function (result) {
            callback(result[0]);
        });

        proxy.after('articleTags', 1 , function (result) {
            result[0].article.getHots({
                'where':{
                    'userId':user.id
                }
            }).then(function(hots){
                if(hots&&hots.length>0){
                    result[0].isActiveHot  =   true;
                }
                return proxy.emit('articleHots',result[0]);
            });

        });

        proxy.after('articleFiles', 1 , function (result) {
            result[0].article.getTags().then(function(tags){
                if(tags.length>0){
                    result[0].tags=tags;
                }
                return proxy.emit('articleTags',result[0]);
            });

        });


        proxy.after('result', 1 , function (result) {
            result[0].article.getFiles().then(function(files){
                if(files.length>0){
                    result[0].files=files;
                }
                return proxy.emit('articleFiles',result[0]);
            });
        });

        if(articleUser.creator != articleUser.userId){
            //处理下是否显示 取消关注的按钮 条件是 type = 2    0:自创,1:转载,2:关注文章
            item.isShowReprint        =   true;
            if(articleUser.type +'' == '2'){
                result.isShowCancleFollow = true;
            }
            if(articleUser.type +'' == '1'){
                result.isShowReprint = false;
            }
            result.isShowHot       =   true;
            result.user = user;

            return proxy.emit('result',result);
        }else{
            result.user = user;
            proxy.emit('result',result);
        }
    });

};