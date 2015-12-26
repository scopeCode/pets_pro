/**
 * 公共的 Web Response  主要处理 POST 返回值
 * Created by scj-mo on 2015/12/7.
 */

exports.success         =   function(data){
    var json    =   {'result':1,'data':{},'msg':''};
    if(data){
        json.data   =   data;
    }
    return json;
};

exports.fail            =   function(msg){
    var json    =   {'result':0,'data':{},'msg':''};
    if(msg){
        json.msg   =   msg;
    }
    return json;
};

