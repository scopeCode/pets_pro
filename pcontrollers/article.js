/**
 * 文章信息路由设定
 * Created by scj-mo on 2015/12/8.
 */
var EventProxy      =   require('eventProxy');
var articleProxy    =   require('../proxy/article');
var commonResponse  =   require('../common/commonResponse');

exports.createTextArticle = function (req, res, next) {
    try{

        var ep  =   new EventProxy();
        ep.fail(next);

        ep.on('prop_err', function (msg) {
            res.json(commonResponse.fail(msg));
        });

        //获取 当前用户的信息
        var user = req.session.user.user;
        var userId  =   user.id;
        //获取页面提交的信息
        var title   =   req.body.title;
        var content =   req.body.content;
        var tags    =   req.body.tags;
        var type    =   req.body.type||'1';//默认是1 文字的处理

        // 验证信息的正确性
        if ([title,content].some(function (item) { return item === ''; })) {
            ep.emit('prop_err', '信息不完整。');
            return;
        }
        if (title.length < 5 && title.length > 15) {
            ep.emit('prop_err', '标题至少需要5个字符。最长不超过15个字符.');
            return;
        }
        // END 验证信息的正确性

        var tagsArr = tags.split('$$$$$');
        articleProxy.createArticle(
            {
                'title':title,
                'content':content,
                'type':type
            },
            tagsArr,[],userId,function(data){
            res.json(commonResponse.success());
        });

    }catch(ex){
        next(ex);
    }
};

exports.createLinkArticle = function (req, res, next) {
    try{

        var ep  =   new EventProxy();
        ep.fail(next);

        ep.on('prop_err', function (msg) {
            res.json(commonResponse.fail(msg));
        });

        //获取 当前用户的信息
        var user = req.session.user.user;
        var userId  =   user.id;
        //获取页面提交的信息
        var title   =   req.body.title;
        var content =   req.body.content;
        var tags    =   req.body.tags;
        var type    =   req.body.type||'1';//默认是1 文字的处理
        // END 验证信息的正确性

        var tagsArr = tags.split('$$$$$');
        articleProxy.createArticle(
            {
                'title':title,
                'content':content,
                'type':type
            },
            tagsArr,[],userId,function(data){
                res.json(commonResponse.success());
            });

    }catch(ex){
        next(ex);
    }
};

exports.createImgArticle = function (req, res, next) {
    try{

        var ep  =   new EventProxy();
        ep.fail(next);

        ep.on('prop_err', function (msg) {
            res.json(commonResponse.fail(msg));
        });

        //获取 当前用户的信息
        var user = req.session.user.user;
        var userId  =   user.id;
        //获取页面提交的信息
        var title   =   req.body.title;
        var content =   req.body.content;
        var tags    =   req.body.tags;
        var type    =   req.body.type||'1';//默认是1 文字的处理
        var files   =   req.body.files;
        // END 验证信息的正确性

        var tagsArr =   tags.split('$$$$$');
        var filesArr=   files.split('$$$$$');

        articleProxy.createArticle(
            {
                'title':title,
                'content':content,
                'type':type
            },
            tagsArr,filesArr,userId,function(data){
                res.json(commonResponse.success());
            });

    }catch(ex){
        next(ex);
    }
};


/**
 * 文章增加热度
 * @param req
 * @param res
 * @param next
 */
exports.articleAddHot   =   function(req,res,next){
    try{
        var articleId   =   req.body.articleId;
        var user        =   req.session.user;

        articleProxy.articleAddHot(articleId,user.user.id,user.user.info.userNick,function(data){
            res.json(commonResponse.success());
        });

    }catch(ex){
        next(ex);
    }
}
/**
 * 文章减去热度
 * @param req
 * @param res
 * @param next
 */
exports.articleDescHot  =   function(req,res,next){
    try{
        var articleId   =   req.body.articleId;
        var user        =   req.session.user;

        articleProxy.articleDescHot(articleId,user.user.id,function(data){
            res.json(commonResponse.success());
        });
    }catch(ex){
        next(ex);
    }
};

/**
 * 文章转载的操作
 * @param req
 * @param res
 * @param next
 */
exports.articleReprint  =   function(req,res,next){
    try{
        var articleId   =   req.body.articleId;
        var userId        =   req.body.userId;
        articleProxy.articleReprint(articleId,userId,function(data){
            res.json(commonResponse.success());
        });
    }catch(ex){
        next(ex);
    }
};

/**
 *
 * @param articleId
 * @param limit
 * @param pageSize
 */
exports.queryArticleLogByArticleId  =   function(req, res, next){

    var articleId =   req.body.articleId;
    var limit     =   req.body.limit;
    var pageSize  =   req.body.pageSize;

    var user = req.session.user.user;
    var userId  =   user.id;

    articleProxy.queryArticleLog(articleId,userId,limit,pageSize,function(err,data){
        if(err){
            next(err);
        }
        res.json(commonResponse.success(data));
    });
};

/**
 * 查询userId的用户的前3篇图片文章
 * @param req
 * @param res
 * @param next
 */
exports.queryTop3Article  =   function(req, res, next){
    var userId      =   req.body.userId;
    articleProxy.queryTop3Article(userId,function(data){
        res.json(commonResponse.success(data));
    });
};

/**
 * 获取文章的信息
 * @param req
 * @param res
 * @param next
 */
exports.queryArticleList =      function(req,res,next){
    var user        =   req.session.user;

    var userId      =   user.user.id;
    var pageNo      =   req.body.pageNo;
    var limit       =   req.body.limit;

    articleProxy.queryArticleListEx(userId,pageNo,limit,function(data){
        res.json(commonResponse.success(data));
    });
};

exports.queryArticleId =      function(req,res,next){
    var userId      =   req.body.userId;
    var articleId       =   req.body.articleId;

    articleProxy.queryArticleById(userId,articleId,function(data){
        res.json(commonResponse.success(data));
    });
};

exports.addComment  =   function(req,res,next){
    var user        =   req.session.user;
    var fromUserId  =   user.user.id;
    var userId      =   req.body.userId;
    var articleId   =   req.body.articleId;
    var comment     =   req.body.comment;

    articleProxy.addComment(userId,fromUserId,articleId,comment,user.user.info.userNick,function(err,data){
        if(err){
            res.json(commonResponse.fail(err.message));
        }
        res.json(commonResponse.success(data));
    })
};