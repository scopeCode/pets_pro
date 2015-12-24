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
        articleProxy.queryArticleList(userObj.id,0,15,function(data){
            res.render('index',{'user':userObj,'data':data});
        });

     }catch(ex){
        next(ex);
    }
};

exports.upLoadFile  =   function(req,res,next){
    try{

    }catch(ex){
        next(ex);
    }
};