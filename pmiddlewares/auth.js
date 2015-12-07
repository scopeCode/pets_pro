/**
 * 验证用户是否需要登录的中间件
 * Created by WG on 2015/12/4.
 */

//用户需要验证登录
exports.loginRequired    =   function(req, res, next){
    if (!req.session || !req.session.user) {
        req.session.error='请先登陆';
        return res.redirect('/user/v_login');
    }
    next();
};