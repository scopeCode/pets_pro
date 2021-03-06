/**
 * 七牛主文件处理
 * Created by scj-mo on 2015/12/21.
 */
var qiniu   = require('qiniu');
var fs      = require("fs");

var  qn = {};
var config ={
    ACCESS_KEY:'YYFZ8Mv3gARmlE8-MDc-zj8Yp0p__SoQj6u_Vjuc',
    SECRET_KEY:'Qpmmt-jax55bZxWVC0lLmE__QJgEAfAyGG1CUkVZ',
    BUCKETNAME:'baby',
};

qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;
/***
 * 七牛上传文件
 * @param key       可以是 文件名称   也可以是 img/文件名
 * @param filePath  可以直接获取
 * @param success   成功回调函数
 * @param error     失败回调函数
 */
qn.putFile = function(key,filePath,_config,success,error){
    //如果没有设定 则是默认
    config = extend(config,_config);
    success = success || function(){};
    error = error || function(){};

    var putPolicy = new qiniu.rs.PutPolicy(config.BUCKETNAME);
    var extra = new qiniu.io.PutExtra();
    var token = putPolicy.token();
    try{
        qiniu.io.putFile(token,key,filePath,extra,function(err, ret){
            if(!err) {
                deleteFile(filePath);
                success(ret);
            }
            else {
                error(err);
            }
        });
    }catch(ex){
        error(ex);
    }
};

qn.putWithoutKey = function(filePath,_config,success,error){
    //如果没有设定 则是默认
    config = extend(config,_config);
    success = success || function(){};
    error = error || function(){};

    var putPolicy = new qiniu.rs.PutPolicy(config.BUCKETNAME);
    var extra = new qiniu.io.PutExtra();
    var token = putPolicy.token();
    try{
        //(uptoken, loadFile, extra, onret)
        qiniu.io.putFileWithoutKey(token,filePath,extra,function(err, ret){
            if(!err) {
                deleteFile(filePath);
                success(ret);
            }
            else {
                error(err);
            }
        });
    }catch(ex){
        error(ex);
    }
};

function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

//删除临时文件
function deleteFile(url){
    fs.exists(url,function(exists){
        if(exists){
            fs.unlink(url, function(){});
        }
    });
}
module.exports = qn;