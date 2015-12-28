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

        //获取当前用户的关注的人
        ep.on('getFollows',function(articles,totalHotUser,todayHotUser){

            userProxy.getFollowUser(userObj.id,function(data){

                //过滤得到totalHotUser 是否 关注过这个人
                var len             = data.length;

                if(len > 0){
                    //---总排行榜的处理
                    var _len = totalHotUser.length;
                    for(var m=0;m<_len;m++){
                        var total = totalHotUser[m];

                        (function(total,m){

                            for(var j=0;j<len;j++){
                                var item = data[j];
                                if(total && total.info.userId == item.followUserId){
                                    totalHotUser[m].info.isFollowed = true;
                                    break;
                                }
                            }

                        })(total,m);
                    }
                }

                res.render('index',{
                    'user':userObj,
                    'data':articles,
                    'todayHotUser':todayHotUser,
                    'totalHotUser':totalHotUser
                });
            });
        });

        //调用 getTotalHotUser
        ep.on('getTotalHotUser',function(articles){
            userProxy.getTotalHotUser(userObj.id,function(data){
                ep.emit('getTodayHotUser',articles,data);
            });
        });

        //调用 getTodayHotUser
        ep.on('getTodayHotUser',function(articles,totalHotUser){
            userProxy.getTodayHotUser(userObj.id,function(data){
                ep.emit('getFollows',articles,totalHotUser,data);
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