/**
 * 关于用户操作的数据库处理
 * Created by scj-mo on 2015/12/6.
 */
var models      =   require('../pmodels/models');
var sequelize   =   require('../pmodels/index').sequelize;
var EventProxy  =   require('eventproxy');

var Article         =   models.Article;
var File            =   models.File;
var Tag             =   models.Tag;
var Log             =   models.Log;
var Hot             =   models.Hot;
var ArticleHot      =   models.ArticleHot;

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
        ],
        where:{
            id:{
                $ne:userId
            }
        },
        'order':' totalCnt desc ',
        'limit':5
    }).then(function(data){

        var dataLen     =   data.length;
        if(dataLen>0){
            var proxy = new EventProxy();
            proxy.after('result', dataLen , function (totalUserCnts) {
                callback(totalUserCnts);
            });
            User.findById(userId).then(function(user){
                for(var i=0;i<dataLen;i++){
                    var item = data[i];
                    (function(item){
                        user.getUserFollows({
                            'where':{
                                'followUserId':item.id   //当前用户的userID
                            }
                        }).then(function(userFollow){
                            item.userFollow = userFollow && userFollow.length>0 ? true : false;
                            proxy.emit('result',item);
                        });

                    })(item);
                }
            });

        }else{
            callback([]);
        }
    });
};

/**
 * 获取整个项目 今天 得分最高的一个,不包括自己
 * @param userId
 * @param callback
 */
exports.getTodayHotUser             =   function(userId,callback){
    try{
        User.find({
            include:[
                {
                    'model' : Info
                }
            ],
            where:{
                id:{
                    $ne : userId
                }
            },
            'order' :  ' todayCnt desc ',
            'limit' : 1
        }).then(function(data){

            var result = {};
            result.user =   data;
            //获取当日最高的人的用户ID
            var _userId = data.id;
            Article.findAll({
                'include': [
                    {
                        'model': Tag
                    },
                    {
                        'model': File
                    },
                    {
                        'model': User,
                        'where':{
                            'id' : _userId
                        }
                    }
                ],
                offset: 0,
                limit: 15,
                order:' created desc '
            }).then(function(articles){
                if(articles && articles.length > 0){
                    var articleObj = articles[0];
                    result.article = articles[0];

                    UserFollow.find
                    ({'where':{
                            'userId':userId,
                            'followUserId':_userId
                    }}).then(function(userFollow){
                        result.userFollow = userFollow ? true : false;

                        articleObj.getHots(
                            {
                                'where':
                                {
                                    'userId':userId
                                }
                        }).then(function(articleHot){
                                result.articleHot = articleHot&&articleHot.length>0 ? true : false;
                                callback(result);
                        });
                    });
                }else{//没有发布文章
                    callback(result);
                }
            });
        });
    }catch(ex){
        console.error(ex);
    }
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

/**
 * 用户关注用户
 * @param userId
 * @param followUserId
 * @param callback
 * @returns {*}
 */
exports.createUserFollow   =   function(userId,followUserId,callback){

    //TODO 需要处理是否已经关注过了的验证  留
    //TODO 没有加操作日志
    return sequelize.transaction(function (t) {
        return User.findById(userId, {transaction: t}).then(function(user){
           return user.createUserFollow({
               followUserId:followUserId
           }, {transaction: t}).then(function(){
               return User.findById(followUserId,{
                   include:[
                       {
                           'model' : Info
                       }
                   ]
               }, {transaction: t}).then(function(followUser){

                    var totalCnt     = parseInt(followUser.info.totalCnt) + 1;
                    var todayCnt     = parseInt(followUser.info.todayCnt) + 1;

                    return Info.update({
                        'totalCnt':totalCnt,
                        'todayCnt':todayCnt
                    },
                    {
                        'where':{
                            'userId':followUserId
                        }
                    }, {transaction: t});
               });
           });
        });
    }).then(function (result) {
        callback(null,result);
    }).catch(function (err) {
        callback(err,null);
    });
};

/**
 * 取消关注
 * @param userId
 * @param followUserId
 * @param callback
 * @returns {*}
 */
exports.cancelFollowUser   =   function(userId,followUserId,callback){

    //TODO 需要处理是否已经关注过了的验证
    //TODO 没有加操作日志
    return sequelize.transaction(function (t) {
        return User.findById(userId, {transaction: t}).then(function(user){

            return user.getUserFollows({
                'where':{
                    followUserId:followUserId
                }
            }, {transaction: t}).then(function(userFollow){

                return userFollow[0].destroy({transaction: t}).then(function(resUserFollow){;

                    return User.findById(followUserId,{
                        include:[
                            {
                                'model' : Info
                            }
                        ]
                    }, {transaction: t}).then(function(followUser){

                        var totalCnt     = parseInt(followUser.info.totalCnt) - 1;
                        var todayCnt     = parseInt(followUser.info.todayCnt) - 1;

                        return Info.update({
                                'totalCnt':totalCnt,
                                'todayCnt':todayCnt
                            },
                            {
                                'where':{
                                    'userId':followUserId
                                }
                            }, {transaction: t});
                    });
                });
            });
        });
    }).then(function (result) {
        callback(null,result);
    }).catch(function (err) {
        callback(err,null);
    });
};

/**
 *
 * 用户的信息 修改
 * @param bgPhoto
 * @param photo
 * @param nick
 * @param sign
 * @param oldpwd
 * @param newpwd
 */
exports.saveSetting     =   function(userId,bgPhoto,photo,nick,sign,pwd,callback){
    return sequelize.transaction(function (t) {
        return  Info.findOne({
            where: {
                'id': userId
            }
        },{transaction: t}).then(function(info){
            info.bgPhoto = bgPhoto;
            info.photo = photo;
            info.userNick   =   nick;;
            info.sign   =   sign;
            return info.save({transaction: t}).then(function(){
                return User.findById(userId,{transaction: t}).then(function(user){
                    user.userPwd =pwd;
                    return user.save({transaction: t});
                });
            });
        });
    }).then(function (result) {
        callback(null,result);
    }).catch(function (err) {
        callback(err,null);
    });
};