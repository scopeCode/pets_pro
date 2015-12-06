/**
 * 关于用户操作的数据库处理
 * Created by scj-mo on 2015/12/6.
 */
var eventProxy  =   require('eventProxy');
var models      =   require('../pmodels');
var User        =   models.User;
var UserInfo    =   models.UserInfo;


/**
 * 根据   UserName    查询用户信息
 * @param loginName
 * @param callback
 */
exports.getUserByUserName       =   function(loginName,callback){
    User.findOne({'USER_NAME': loginName}, callback);
};

/**
 * 创建一条新的用户信息
 * @param loginName
 * @param pwd
 * @param callback
 */
exports.createUser              =   function(loginName,pwd,callback){
    var    user     =   new User();
    user.USER_NAME  =   loginName;
    user.USER_PWD   =   pwd;
    user.save(callback);
};

/**
 * 创建用户信息表的信息
 * @param userId
 * @param nick
 * @param callback
 */
exports.createUserInfo          =   function(userId,nick,callback){
    var  userInfo       =   new UserInfo();
    userInfo.USER_ID    =   userId;
    userInfo.NICK       =   nick;

    userInfo.save(callback);
};