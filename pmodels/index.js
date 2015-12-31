/**
 * 建立mongoose对象,引入数据库模型
 * Created by WG on 2015/11/28.
 */
var Sequelize   =   require('sequelize');
var config ={
    database:'r3414lyt8a',
    username:'r3414lyt8a',
    password:'123456a',
    options:{
        host:'rdsmqqw8evvmt1e7n485.mysql.rds.aliyuncs.com',
        port:'3306',
        dialect : 'mysql',
        timezone:'+08:00',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        define: {
            freezeTableName: true,
            timestamps:false
        }
    },
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
};
exports.sequelize  = new Sequelize(config.database, config.username, config.password, config.options);
exports.Sequelize  = Sequelize;