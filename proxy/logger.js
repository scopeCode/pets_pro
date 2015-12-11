/**
 * 关于日志的操作
 * Created by scj-mo on 2015/12/11.
 */

var models          =   require('../pmodels');
var Logger          =   models.Logger;

exports.createLogger      =   function(type,content,callback){
    var  logger                 =   new Logger();
    logger.CONTENT         =    content;
    logger.TYPE            =    type;

    logger.save(callback);
};