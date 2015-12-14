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
        var userId  = req.session.user.user._id;

        articleProxy.getAllArticleByUid(0,15,userId,function(err,data){
            if(err){
                return next(err);
            }
            res.render('index', {'user':req.session.user.user,'userInfo':req.session.user.userInfo,'data':data});
        });
     }catch(ex){
        next(ex);
    }
};
