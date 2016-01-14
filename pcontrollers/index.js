/**
 * 全局个人页面
 * Created by WG on 2015/12/5.
 */
var EventProxy      =   require('eventProxy');
var articleProxy    =   require('../proxy/article');
var userProxy       =   require('../proxy/user');
var commonResponse  =   require('../common/commonResponse');

/**
 * show index page
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.show = function (req, res, next) {
    try{
        var userObj =   req.session.user.user;


        /*articleProxy.queryArticleById(1,1,function(data){
            var data = data;
        });*/
        /*require('../proxy/log').queryLogByUserId(1,2,0,15,function(err,data){
                var d = data;
        });*/

        var ep  = new EventProxy();
        ep.fail(next);

        //调用 getTotalHotUser
        ep.on('getTotalHotUser',function(articles){
            userProxy.getTotalHotUser(userObj.id,function(data){
                ep.emit('getTodayHotUser',articles,data);
            });
        });

        //调用 getTodayHotUser
        ep.on('getTodayHotUser',function(articles,totalHotUser){
            userProxy.getTodayHotUser(userObj.id,function(todayHotUser){

                res.render('index',{
                    'user':userObj,
                    'data':articles,
                    'todayHotUser':todayHotUser,
                    'totalHotUser':totalHotUser
                });

            });
        });

        //请求获取文章列表
        articleProxy.queryArticleListEx(userObj.id,0,15,function(data){
            ep.emit('getTotalHotUser',data);
        });
     }catch(ex){
        next(ex);
    }
};

/**
 *  建立关注的操作
 * @param req
 * @param res
 * @param next
 */
exports.createFollowUser    =   function(req,res,next){
    try{
        var userObj         =   req.session.user.user;
        var followUserId    =   req.body.followUserId;

        userProxy.createUserFollow(userObj.id,followUserId,function(error,data){
            if(error){
                res.json(commonResponse.fail('已关注过了.'));
            }else{
                res.json(commonResponse.success());
            }
        });

    }catch(ex){
        next(ex);
    }
};

/**
 * 取消关注
 * @param req
 * @param res
 * @param next
 */
exports.cancelFollowUser    =   function(req,res,next){
    try{
        var userObj         =   req.session.user.user;
        var followUserId    =   req.body.followUserId;

        userProxy.cancelFollowUser(userObj.id,followUserId,function(error,data){
            if(error){
                res.json(commonResponse.fail('已关注过了.'));
            }else{
                res.json(commonResponse.success());
            }
        });

    }catch(ex){
        next(ex);
    }
};