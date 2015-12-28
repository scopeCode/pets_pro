/**
 * 关于用户操作的数据库处理
 * Created by scj-mo on 2015/12/6.
 */
var models      =   require('../pmodels/models');
var sequelize   =   require('../pmodels/index').sequelize;

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
        callback(data);
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
                    result.article = articles[0];

                    result.user.getUserFollows({
                        'where':{
                            'userId':_userId, //找到当日最高的人的ID
                            'followUserId':userId   //当前用户的userID
                        }
                    }).then(function(userFollow){
                        result.userFollow = userFollow && userFollow.length>0 ? true : false;

                        result.article.getHots({
                            'where':{
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