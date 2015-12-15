/**
 * 全局个人页面
 * Created by WG on 2015/12/5.
 */

var articleProxy     =   require('../proxy/article');

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
        articleProxy.queryArticleList(userObj.id,function(data){
            res.render('index',{'user':userObj,'data':data});
        });

     }catch(ex){
        next(ex);
    }
};
