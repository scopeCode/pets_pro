/**
 * 全局路由的设定
 * Created by WG on 2015/12/5.
 */
var index               = require("./pcontrollers/index");
var login               = require("./pcontrollers/login");
var register            = require("./pcontrollers/register");
var auth                = require("./pmiddlewares/auth");

module.exports = function (app) {

    //[PC端主站处理]-------------------------------------------------------------------\\
    app.route("/").all(auth.loginRequired).get(index.show);

    //[PC端核心业务处理]-----------------------------------------------------------------\\

    //[用户处理 ]-----------------------------------------------------------------\\
    app.route('/user/v_login').get(login.show);
    app.route('/user/v_register').get(register.show);
    app.route('/user/create').post(register.create);
    app.route('/user/v_index').all(auth.loginRequired).get(index.show);
    app.route('/user/login').post(login.login);
    app.route('/user/logout').get(login.logout);


};