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
    try{

        User.findOne({
            include:[
                {
                    'model' : Info
                },
                {
                    'model' : Article,
                    'order':' created desc ',
                    'include': [
                        {
                            'model': Tag
                        },
                        {
                            'model': File
                        },
                        {
                            'model': Hot,
                            'where':{

                            }
                        }
                    ]
                }
            ],
            where:{
                id:{
                    $ne : userId
                }
            },
            'order' :  ' todayCnt desc '
        }).then(function(data){


            //1: 是否已经加热过
            //2：是否可以转载此篇文章
            //3: 是否 关注过这个人




            /*if(data.articles && data.articles.length>0){
                data.article = data.articles[0];
                data.articles = [];

                //--处理界面的元素控制
                data.article.isShowCancleFollow   =   false;     //是否显示取消关注的按钮
                data.article.isShowReprint        =   false;     //是否显示 转发类的按钮
                data.article.isShowHot            =   false;     //显示 已经有热度还是没有热度
                data.article.isActiveHot          =   false;     //显示 已经有热度还是没有热度

                if(data.article.articleUser.creator != data.article.articleUser.userId){
                    //处理下是否显示 取消关注的按钮 条件是 type = 2    0:自创,1:转载,2:关注文章
                    data.article.isShowReprint        =   true;

                    if(data.article.articleUser.type +'' == '2'){
                        data.article.isShowCancleFollow = true;
                    }
                    if(data.article.articleUser.type +'' == '1'){
                        data.article.isShowReprint = false;
                    }
                }

                //查询这个人 是否 和 这篇文章 有关联
                UserFollow.findAll({
                    where:{
                        userId      :   data.id,
                        followUserId:   userId
                    }
                }).then(function(_data){

                    if(_data){//有关联
                        data.article.isShowCancleFollow   =   true;
                    }else{

                    }

                    callback(data);
                });
            }else{
                callback(data);
            }*/

           callback(data);
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