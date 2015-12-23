/**
 * 关于日志的操作
 * Created by scj-mo on 2015/12/11.
 */
var models          =   require('../pmodels');
var SysLogger       =   models.SysLogger;

exports.createLogger    =   function(type,content,userId,callback){
    SysLogger.create({type :type,content:content,userId:userId}).then(callback);
};