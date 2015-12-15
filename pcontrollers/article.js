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
            var tagsArr = tags.split(' ');
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