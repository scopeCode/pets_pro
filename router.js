/**
 * 全局路由的设定
 * Created by WG on 2015/12/5.
 */
var index               = require("./pcontrollers/index");
var login               = require("./pcontrollers/login");
var register            = require("./pcontrollers/register");

module.exports = function (app) {

    //[PC端主站处理]-------------------------------------------------------------------\\
    app.route("/").get(index.show);//.all(login.authentication)

    //[PC端核心业务处理]-----------------------------------------------------------------\\

    //[登录处理]-----------------------------------------------------------------\\
    app.route("/user/v_login").get(login.show);
    //[注册处理]-----------------------------------------------------------------\\
    app.route("/user/v_register").get(register.show);

};