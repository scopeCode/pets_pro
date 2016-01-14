/**
 * 全局路由的设定
 * Created by WG on 2015/12/5.
 */
var index               =   require("./pcontrollers/index");
var user                =   require("./pcontrollers/user");
var setting             =   require("./pcontrollers/setting");
var log                 =   require("./pcontrollers/log");
var login               =   require("./pcontrollers/login");
var register            =   require("./pcontrollers/register");
var auth                =   require("./pmiddlewares/auth");
var article             =   require("./pcontrollers/article");
var common              =   require("./pcontrollers/common");

module.exports = function (app) {

    //[PC端主站处理]-------------------------------------------------------------------\\
    app.route("/").all(auth.loginRequired).get(index.show);

    //[PC端核心业务处理]-----------------------------------------------------------------\\

    //[用户处理 ]-----------------------------------------------------------------\\
    app.route('/user/v_login').get(login.show);
    app.route('/user/v_register').get(register.show);
    app.route('/user/create').post(register.createUser);
    app.route('/user/login').post(login.login);
    app.route('/user/logout').get(login.logout);

    app.route('/user/follow').all(auth.loginRequired).post(index.createFollowUser);
    app.route('/user/cancelFollow').all(auth.loginRequired).post(index.cancelFollowUser);
    app.route('/user/getTop3ArticleFile').all(auth.loginRequired).post(article.queryTop3Article);
    //用户设置
    app.route('/user/setting').all(auth.loginRequired).get(setting.show);
    app.route('/user/savesetting').all(auth.loginRequired).post(setting.saveSetting);

    app.route('/user/queryFollowUserInfo').all(auth.loginRequired).post(user.queryFollowUserInfo);
    app.route('/user/queryFollowedUserInfo').all(auth.loginRequired).post(user.queryFollowedUserInfo);

    //[文章处理 ]-----------------------------------------------------------------\\
    app.route('/user/article/createTextArticle').all(auth.loginRequired).
        post(article.createTextArticle);
    app.route('/user/article/createLinkArticle').all(auth.loginRequired).
        post(article.createLinkArticle);
    app.route('/user/article/createImgArticle').all(auth.loginRequired).
        post(article.createImgArticle);

    app.route('/user/article/articleAddHot').all(auth.loginRequired).
        post(article.articleAddHot);
    app.route('/user/article/articleDescHot').all(auth.loginRequired).
        post(article.articleDescHot);
    app.route('/user/article/articleReprint').all(auth.loginRequired).
        post(article.articleReprint);
    app.route('/user/article/queryArticleLogByArticleId').all(auth.loginRequired).
        post(article.queryArticleLogByArticleId);
    app.route('/user/article/queryArticleList').all(auth.loginRequired).
        post(article.queryArticleList);

    //[message处理 ]-----------------------------------------------------------------\\
    app.route('/user/message/v_show').all(auth.loginRequired).get(log.show);
    app.route('/user/message/query').all(auth.loginRequired).post(log.queryLog);

    //[common处理 ]-----------------------------------------------------------------\\
    app.route('/user/link/getTitle').all(auth.loginRequired).
        post(common.getPageTitle);
    app.route('/upload').all(auth.loginRequired).
        post(common.upLoadFile);

    //TODO 1: 取消关注时 的bug
    //TODO 2: 有关 点赞 转发 评论 是否都需要加数量 啊 ??
};