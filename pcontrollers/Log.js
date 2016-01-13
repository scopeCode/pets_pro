/**
 * 用户的操作日志处理
 * Created by scj-mo on 2016/1/13.
 */
var logProxy        =   require('../proxy/log');
var commonResponse  =   require('../common/commonResponse');

exports.show        =   function(req,res,next){
    res.render('message');
};

/**
 * 查询操作日志根据USERid
 * @param req
 * @param res
 * @param next
 */
exports.queryLog    =   function(req,res,next){
    var userObj     =       req.session.user.user;
    var userId      =       userObj.id;

    var limit       =   req.body.limit;
    var pageno      =   req.body.pageno;
    var type        =   req.body.type;

    logProxy.queryLogByUserId(userId,type,pageno,limit,function(err,data){
        if(err){
            next(err);
        }
        res.json(commonResponse.success(data));
    });
};