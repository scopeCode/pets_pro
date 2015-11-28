/**
 * Created by WG on 2015/11/17.
 * 系统级别的配置信息
 */
var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    site_static_host        :       '',// 静态文件存储域名
    host                    :       'localhost',
    mongodb                 :        'mongodb://127.0.0.1/pets_club_dev',

    // redis 配置，默认是本地
    redis_host              :         '127.0.0.1',
    redis_port              :         6379,
    redis_db                :         0,

    session_secret          :         'pets_club_secret', // 务必修改
    auth_cookie_name        :         'pets_club_cookie',

    qn_access: {
        accessKey           :          'YYFZ8Mv3gARmlE8-MDc-zj8Yp0p__SoQj6u_Vjuc',
        secretKey           :          'Qpmmt-jax55bZxWVC0lLmE__QJgEAfAyGG1CUkVZ',
        bucket              :          'baby'
    },
    port                    :           80
};

if (process.env.NODE_ENV === 'test') {
    config.mongodb = 'mongodb://127.0.0.1/pets_club_test';
}

module.exports = config;