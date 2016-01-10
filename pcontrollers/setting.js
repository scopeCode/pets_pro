/**
 * Created by scj-mo on 2016/1/11.
 */

var userProxy       =   require('../proxy/user');
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
        res.render('setting',{'user':userObj,'info':userObj.info});
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
        var bgPhoto =   req.body.bgPhoto;
        var photo   =   req.body.photo;
        var nick    =   req.body.nick;
        var sign    =   req.body.sing;
        var oldpwd  =   req.body.oldpwd;
        var newpwd  =   req.body.newpwd;

        if(oldpwd != userObj.pwd){
            ep.emit('prop_err', '老密不正确.');
            return false;
        }

        var md5Str   =   utils.md5(newpwd,'base64');

        userProxy.saveSetting(userObj.id,bgPhoto,photo,nick,sign,md5Str,function(err,data){
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