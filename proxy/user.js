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
    /*var    user     =   new User();
    user.USER_NAME  =   loginName;
    user.USER_PWD   =   pwd;
    user.save(callback);*/
};

/**
 * 创建用户信息表的信息
 * @param userId
 * @param nick
 * @param callback
 */
exports.createUserInfo          =   function(userId,nick,callback){
    UserInfo.create({
        userId      :userId,
        userNick    :nick
    }).then(callback);
    /*var  userInfo       =   new UserInfo();
    userInfo.USER_ID    =   userId;
    userInfo.NICK       =   nick;
    userInfo.save(callback);*/
};


/**
 * 根据   UserName    查询用户信息
 * @param loginName
 * @param callback
 */
exports.getUserByUserName       =   function(loginName,callback){
        User.findOne({
            'where': {
                'USER_NAME': loginName
            }
        }).then(function(u){
            callback(u);
        });

    //User.findOne({'USER_NAME': loginName}, callback);
};

/**
 * 根据userId 返回用户的信息
 * @param userId
 * @param callback
 */
exports.getUserInfoById         =   function(userId,callback){
    UserInfo.findOne({'USER_ID': userId}, callback);
};
