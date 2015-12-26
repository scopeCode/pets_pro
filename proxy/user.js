/**
 * 关于用户操作的数据库处理
 * Created by scj-mo on 2015/12/6.
 */
var models      =   require('../pmodels/models');
var sequelize   =   require('../pmodels/index').sequelize;

var User        =   models.User;
var UserFollow  =   models.UserFollow;
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
            include:[
                {
                    'model':Info
                }
            ]
        }).then(function(u){
            callback(u);
        });
};

/**
 * 获取整个项目的 得分最高的一个,不包括自己
 * @param userId
 * @param callback
 */
exports.getTotalHotUser             =   function(userId,callback){
    User.findAll({
        include:[
            {
                'model':Info
            }
            /*,
            {
                'model':UserFollow
            }*/
        ],
        where:{
            id:{
                $ne:userId
            }
        },
        'order':' totalCnt desc ',
        'limit':5
    }).then(function(data){
        callback(data);
    });
};

/**
 * 获取整个项目 今天 得分最高的一个,不包括自己
 * @param userId
 * @param callback
 */
exports.getTodayHotUser             =   function(userId,callback){
    User.findOne({
        include:[
            {
                'model' : Info
            }/*,
            {
                'model' : UserFollow
            }*/
        ],
        where:{
            id:{
                $ne : userId
            }
        },
        'order' :  ' todayCnt desc '
    }).then(function(data){
        callback(data);
    });
};

/**
 * 获取当前用户关注的人的信息
 * @param userId
 * @param callback
 */
exports.getFollowUser   =   function(userId,callback){
    UserFollow.findAll({
        where:{
            userId:userId
        }
    }).then(function(data){
        callback(data);
    });
};