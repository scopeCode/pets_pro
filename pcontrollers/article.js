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
        var user        =   req.session.user;
        var userId      =   user.user.id;

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

    articleProxy.queryArticleLog(articleId,limit,pageSize,function(data){
        res.json(commonResponse.success(data));
    });
}