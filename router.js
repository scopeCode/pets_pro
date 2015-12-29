/**
 * 全局路由的设定
 * Created by WG on 2015/12/5.
 */
var index               =   require("./pcontrollers/index");
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

    //[文章处理 ]-----------------------------------------------------------------\\
    app.route('/user/article/createTextArticle').all(auth.loginRequired).
        post(article.createTextArticle);
    app.route('/user/article/createLinkArticle').all(auth.loginRequired).
        post(article.createLinkArticle);

    app.route('/user/article/articleAddHot').all(auth.loginRequired).
        post(article.articleAddHot);
    app.route('/user/article/articleDescHot').all(auth.loginRequired).
        post(article.articleDescHot);
    app.route('/user/article/articleReprint').all(auth.loginRequired).
        post(article.articleReprint);
    app.route('/user/article/queryArticleLogByArticleId').all(auth.loginRequired).
        post(article.queryArticleLogByArticleId);

    //[common处理 ]-----------------------------------------------------------------\\
    app.route('/user/link/getTitle').all(auth.loginRequired).
        post(common.getPageTitle);


};