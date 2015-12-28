/**
 * 全局个人页面
 * Created by WG on 2015/12/5.
 */
var EventProxy      =   require('eventProxy');
var articleProxy     =   require('../proxy/article');
var userProxy       =   require('../proxy/user');

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
        articleProxy.queryArticleList(userObj.id,0,15,function(data){
            ep.emit('getTotalHotUser',data);
        });
     }catch(ex){
        next(ex);
    }
};