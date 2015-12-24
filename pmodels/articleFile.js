/**
 * Created by WG on 2015/12/24.
 */
var mysqlCient = require('../pmodels/index');
var ArticleFile = mysqlCient.sequelize.define('articleFile',
{
    status:
    {
        type:mysqlCient.Sequelize.BOOLEAN,
        field:"status",
        defaultValue: true,
        comment:'关系的状态'
    }
},
{
    freezeTableName: true,      //冻结表名_使用自己设定的表名进行定义
    timestamps:false,           //排除掉,默认的 updateAt createdAt 两个字段
    tableName:'articleFile' //自定义表名
});
exports.ArticleFile     =   ArticleFile;