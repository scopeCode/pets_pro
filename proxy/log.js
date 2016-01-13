/**
 * 用户的操作日志
 * Created by scj-mo on 2016/1/13.
 */

var models      =   require('../pmodels/models');
var EventProxy  = require('eventproxy');
var Log         =   models.Log;
var User        =   models.User;
var Info        =   models.Info;

/**
 *  根据用户ID 和 类型 进行查询 消息和动态
 * @param userId
 * @param type    type=1 消息的查询  type=2 动态的查询
 * @param limit
 * @param pageSize
 * @param callback
 */
exports.queryLogByUserId    =   function(userId,type,pageNo,limit,callback){
    try{
        //comment:'类型操作符  1:热度 2:评论  3：转发'  type=1 的时候 查询的是评论  否则的是 其他的
        var offset  =   limit * pageNo;
        var opt     =   null;
        if(type +'' == 1){
            opt = 2;
        }else{
            opt = {$ne:2}
        }
        Log.findAll({
            'where':{
                'userId':userId,
                'type':opt
            },
            'order' :   ' created desc ',
            'limit' :   limit,
            'offset':   offset,
        }).then(function(logs){
            var len = logs.length;

            var  ep = new EventProxy();
            ep.after('result', len , function (result) {
                callback(null,result);
            });

            for(var i=0;i<len;i++){
                var item = logs[i];
                (function(item,i){
                    var fromUserId  = item.fromUserId;
                    var data = {'log':item};
                    User.findById(fromUserId,{
                        include:[
                            {
                                'model' : Info
                            }
                        ]
                    }).then(function(user){
                        data.user   =   user;
                        data.info   =   user.info;
                        if(len - 1 == i){
                            return ep.emit('result',data);
                        }
                        ep.emit('result',data);
                    });
                })(item,i);
            }

        });
    }catch(ex){
        callback(ex,null);
    }
};