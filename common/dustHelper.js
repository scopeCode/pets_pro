/**
 * dustJs 公共类的处理
 * Created by WG on 2015/12/10.
 */

module.exports = function(dust){

    /**
     * 时间格式化帮助类
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     * @returns {*}
     */
    dust.helpers.formatDate = function (chunk, context, bodies, params) {
        var value = params.value,
            timestamp,
            month,
            date,
            year;

        timestamp = new Date(value);
        month = timestamp.getMonth() + 1;
        date = timestamp.getDate();
        year = timestamp.getFullYear();

        return chunk.write(year + '/' + month + '/' + date);
    };




};