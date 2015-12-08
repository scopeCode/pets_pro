/**
 * 登录页面的所有 路由的请求设定
 * Created by WG on 2015/12/5.
 */
var EventProxy      =   require('eventProxy');
var userProxy       =   require('../proxy/user');
var utils           =   require('utility');
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
        res.render('login');
    }catch(ex){
        next(ex);
    }
};

/**
 * user  logout
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.logout = function (req, res, next) {
    try{
         if(req.session && req.session.user){
             req.session.user   =   null;
         }
        res.redirect('/user/v_login');
    }catch(ex){
        next(ex);
    }
};

/**
 * 用户登录系统的act
 * @param req
 * @param res
 * @param next
 */
exports.login   =   function(req,res,next){
    var userName    =   req.body.userName;
    var pwd         =   req.body.pwd;

    var ep  =   new EventProxy();
    ep.fail(next);

    ep.on('prop_err', function (msg) {
        res.json(commonResponse.fail(msg));
    });

    // 验证信息的正确性
    if ([userName, pwd].some(function (item) { return item === ''; })) {
        ep.emit('prop_err', '信息不完整。');
        return;
    }
    if (userName.length < 5) {  //需要验证 是否是手机号
        ep.emit('prop_err', '用户名至少需要5个字符。');
        return;
    }
    // END 验证信息的正确性

    userProxy.getUserByUserName(userName,function(err,user){
        if(err){return next(err);}
        if(user){
            var md5Str  =   utils.md5(pwd,'base64');
            if(user.USER_PWD    ==  md5Str){
                req.session.user    =   {'userName':user.USER_NAME};
                res.json(commonResponse.success());
            }else{
                ep.emit('prop_err', '密码输入有误.');
            }
        }else{
            ep.emit('prop_err', '该用户不存在.');
        }
    });

};