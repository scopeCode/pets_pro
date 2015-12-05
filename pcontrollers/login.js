/**
 * 登录页面的所有 路由的请求设定
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
        res.render('login');
    }catch(ex){
        next(ex);
    }
};
