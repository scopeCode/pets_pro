/**
 * 关于用户操作的数据库处理
 * Created by scj-mo on 2015/12/6.
 */
var models      =   require('../pmodels');
var User        =   models.User;
var UserInfo    =   models.UserInfo;

/**
 * 创建一条新的用户信息
 * @param loginName
 * @param pwd
 * @param callback
 */
exports.createUser              =   function(loginName,pwd,callback){

    User.create({
        userName:loginName,
        userPwd:pwd
    }).then(function(user){
        if(user){
            UserInfo.create({
                userId      :user.id,
                userNick    :"用户"+loginName.substr(7)
            }).then(function(userInfo){
                callback(user,userInfo);
            });
        }else{
            callback(null);
        }
    });
};


/**
 * 根据   UserName    查询用户信息
 * @param loginName
 * @param callback
 */
exports.getUserByUserName       =   function(loginName,callback){
    User.findOne({
            where: {
                'USER_NAME': loginName
            },
            include:{
                model:UserInfo,
                as:'UserInfo'
            }
        }).then(function(u){
            callback(u);
        });
};

/**
 * 根据userId 返回用户的信息
 * @param userId
 * @param callback
 */
exports.getUserInfoById         =   function(userId,callback){
    UserInfo.findOne({
        'where':{
            'USER_ID' : userId
        }
    }).then(callback);
};
