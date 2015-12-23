/**
 * 和注册相关的路由设定
 * Created by WG on 2015/12/5.
 */
var EventProxy      =   require('eventProxy');
var userProxy       =   require('../proxy/user');
var loggerProxy     =   require('../proxy/logger');
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
        res.render('register');
    }catch(ex){
        next(ex);
    }
};

/**
 * 创建一个用户
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.createUser  =   function(req,res,next){

    var ep  =   new EventProxy();
    ep.fail(next);

    var userName    =   req.body.userName;
    var pwd         =   req.body.pwd;
    var repwd       =   req.body.repwd;

    ep.on('prop_err', function (msg) {
        res.json(commonResponse.fail(msg));
    });
    var  mobileRule     =   /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    // 验证信息的正确性
    if ([userName, pwd, repwd].some(function (item) { return item === ''; })) {
        ep.emit('prop_err', '信息不完整.');
        return;
    }
    if (!mobileRule.test(userName)) {  //需要验证 是否是手机号
        ep.emit('prop_err', '用户名格式不正确.');
        return;
    }
    if (pwd !== repwd) {
        return ep.emit('prop_err', '两次密码输入不一致.');
    }
    // END 验证信息的正确性

    userProxy.getUserByUserName(userName,function(user){
        if(user){
            ep.emit('prop_err', '该用户已经存在.');
        }else{
            var md5Str   =   utils.md5(pwd,'base64');
            userProxy.createUser(userName,md5Str,function(user,info){
                res.json(commonResponse.success());
            });
        }
    });

};