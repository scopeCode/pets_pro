/**
 * 关于用户操作的数据库处理
 * Created by scj-mo on 2015/12/6.
 */
var models      =   require('../pmodels/models');
var sequelize   =   require('../pmodels/index').sequelize;

var User        =   models.User;
var Info        =   models.Info;
var Logger      =   models.logger;

/**
 * 创建一条新的用户信息
 * @param loginName
 * @param pwd
 * @param callback
 */
exports.createUser              =   function(userName,pwd,callback){
    return sequelize.transaction(function (t) {
        return User.create({
                userName    :   userName,
                userPwd     :   pwd
        }, {transaction: t}).then(function (user) {
            return user.createInfo({
                userId      :   user.id,
                userNick    :   "用户"+userName.substr(7)
            }, {transaction: t}).then(function(info){
                var content= JSON.stringify(user) + JSON.stringify(info);
                var type = 'pets.user.register';
                Logger.create({type :type,content:content,userId:user.id});
            });
        });
    }).then(function (result) {
        callback(result);
    }).catch(function (err) {
        console.error(err);
    });
};


/**
 * 根据   UserName    查询用户信息
 * @param loginName
 * @param callback
 */
exports.getUserByUserName       =   function(userName,callback){
    User.findOne({
            where: {
                'userName': userName
            },
            include:{
                model:Info
            }
        }).then(function(u){
            callback(u);
        });
};