/**
 * Created by scj-mo on 2016/1/11.
 */
var EventProxy = require('eventproxy');
var models      =   require('../pmodels/models');
var userProxy       =   require('../proxy/user');
var User            =   models.User;
var Info            =   models.Info;
var commonResponse  =   require('../common/commonResponse');

/***
 *  跳转到设置页面
 * @param req
 * @param res
 * @param next
 */
exports.show = function (req, res, next) {
    try{
        var userObj     =       req.session.user.user;
        User.findById(userObj.id,{
            'include': [
                {
                    'model': Info
                }
            ]
        }).then(function(user){
            res.render('setting',{'user':user,'info':user.info});
        });
    }catch(ex){
        next(ex);
    }
};

/**
 * 保存用户设置的信息
 * @param req
 * @param res
 * @param next bgPhoto,photo,nick,sign,pw
 */
exports.saveSetting =   function(req, res, next){
    try{

        var ep  = new EventProxy();
        ep.fail(next);
        ep.on('prop_err', function (msg) {
            res.json(commonResponse.fail(msg));
        });


        var userObj     =       req.session.user.user;
        var bgPhoto     =   req.body.bgPhoto;
        var photo       =   req.body.photo;
        var nick        =   req.body.nick;
        var sign        =   req.body.sign;


        // 验证信息的正确性
        if ([bgPhoto, photo, nick,sign].some(function (item) { return item === ''; })) {
            ep.emit('prop_err', '信息不完整.');
            return;
        }

        if(nick.length > 10){
            ep.emit('prop_err', '昵称的长度过长.最大长度10.');
            return false;
        }
        if(sign.length > 140){
            ep.emit('prop_err', '签名的长度过长.最大长度140.');
            return false;
        }


        userProxy.saveSetting(userObj.id,bgPhoto,photo,nick,sign,function(err,data){
            if(err){
                ep.emit('prop_err', err);
            }else{
                res.json(commonResponse.success(data));
            }
        });
    }catch(ex){
        next(ex);
    }
};