/**
 * Created by scj-mo on 2016/1/14.
 */
var userProxy       =   require('../proxy/user');
var commonResponse  =   require('../common/commonResponse');

/**
 * 读取我关注的人的信息
 * @param userId
 * @param callback
 */
exports.queryFollowUserInfo =   function(req,res,next){
    var userObj     =   req.session.user.user;
    var userId      =   userObj.id;
    var pageno      =   req.body.pageno;
    var pagesize    =   req.body.pagesize;

    userProxy.queryFollowUserInfo(userId,pageno,pagesize,function(err,data){
        if(err){
            next(err);
        }
        res.json(commonResponse.success(data));
    });
};

/**
 * 我被关注的用户信息
 * @param userId
 * @param pageno
 * @param pagesize
 * @param callback
 */
exports.queryFollowedUserInfo =   function(req,res,next){
    var userObj     =   req.session.user.user;
    var userId      =   userObj.id;
    var pageno      =   req.body.pageno;
    var pagesize    =   req.body.pagesize;

    userProxy.queryFollowedUserInfo(userId,pageno,pagesize,function(err,data){
        if(err){
            next(err);
        }
        res.json(commonResponse.success(data));
    });
};