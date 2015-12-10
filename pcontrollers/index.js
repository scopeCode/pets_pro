/**
 * 全局个人测试页面
 * Created by WG on 2015/12/5.
 */

/**
 * show index page
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.show = function (req, res, next) {
    try{
        res.render('index', {'user':req.session.user.user,'userInfo':req.session.user.userInfo});
    }catch(ex){
        next(ex);
    }
};
