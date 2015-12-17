/**
 * 文章信息路由设定
 * Created by scj-mo on 2015/12/8.
 */
var EventProxy      =   require('eventProxy');
var loggerProxy     =   require('../proxy/logger');
var articleProxy    =   require('../proxy/article');
var utils           =   require('utility');
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

        // 验证信息的正确性
        if ([title,content].some(function (item) { return item === ''; })) {
            ep.emit('prop_err', '信息不完整。');
            return;
        }
        if (title.length < 5 || title.length > 15) {
            ep.emit('prop_err', '标题至少需要5个字符。最长不超过15个字符.');
            return;
        }
        // END 验证信息的正确性

        ep.on('createArticleUser',function(article){
            articleProxy.createArticleUser(article.id,userId,userId,'0',function(data){
                if(tags !=''){ //存储 标签数据
                    ep.emit('createArticleTag',tags,article);
                }else{
                    res.json(commonResponse.success(article));
                }
            });
        });

        ep.on('createArticleTag',function(tags,article){
            var articleId = article.id;
            var tagArr = [];
            var tagsArr = tags.split('$$$$$');
            var tagsArrLen = tagsArr.length;
            for(var i=0;i<tagsArrLen;i++){
                var item = tagsArr[i];
                if(item!=''){
                    var obj = {'articleId':articleId,'tagName':item};
                    tagArr.push(obj);
                }
            }
            articleProxy.batchCreateArticleTag(tagArr,function(data){
                var objRes = {};
                objRes.tags = tagArr;
                objRes.article = article;

                res.json(commonResponse.success(objRes));
            });
        });

        articleProxy.createArticle(title,content,'1',function(article){
            ep.emit('createArticleUser',article);
        });

    }catch(ex){
        next(ex);
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.articleHotSet   =   function (req, res, next) {

    var articleId   =   req.body.articleId;
    var optType     =   req.body.optType; //1:添加 2:取消热度
    var userId      =   req.session.user.user.id;

    var ep  =   new EventProxy();
    ep.fail(next);

    ep.on('updateArticleCnt', function (articleId) {
        //更新 文章表的count + 1;
        articleProxy.updateArticleHotCnt(articleId,optType,function(data){
            switch (optType){
                case  "1":{ep.emit('inertArticleLog',articleId);}break;
                case  "2":{ep.emit('deleteArticleLog',articleId,userId);}break;
            }
        });
    });
    ep.on('deleteArticleLog', function (articleId) {
        //日志表的信息插入一条
        articleProxy.deleteArticleLog(articleId,userId,'1',function(){
            res.json(commonResponse.success());
        });
    });
    ep.on('inertArticleLog', function (articleId) {
        //日志表的信息插入一条
        articleProxy.createArticleLog(articleId,userId,'1',req.session.user.user.UserInfo.userNick + ',攒了此贴.',function(){
            res.json(commonResponse.success());
        });
    });

    switch(optType){
        case "1":{
            //添加 articleHot 一条记录
            articleProxy.createArticleHot(userId,articleId,function(articleHot){
                ep.emit('updateArticleCnt',articleId);
            });
        }break;
        case "2":{
            //删除 articleHot 的状态
            articleProxy.deleteArticleHot(userId,articleId,function(articleHot){
                ep.emit('updateArticleCnt',articleId);
            })
        }break;
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