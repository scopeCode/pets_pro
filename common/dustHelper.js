/**
 * dustJs 公共类的处理
 * Created by WG on 2015/12/10.
 */
var EventProxy      =   require('eventProxy');
var userProxy       =   require('../proxy/user');


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
            year,
            hour,
            min,
            second;

        timestamp = new Date(value);
        month   =   timestamp.getMonth() + 1;
        month   =   ("0"+month).slice(-2);
        date    =   timestamp.getDate();
        date    =   ("0"+date).slice(-2);
        year    =   timestamp.getFullYear();
        hour    =   timestamp.getHours();
        hour    =   ("0"+hour).slice(-2);
        min     =   timestamp.getMinutes();
        min     =   ("0"+min).slice(-2);
        second  =   timestamp.getSeconds();
        second  =   ("0"+second).slice(-2);

        return chunk.write(year + '/' + month + '/' + date +' ' + hour+':'+min+':'+second);
    };


    /**
     * 显示 链接 的 帮助类
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     * @returns {*}
     * @constructor
     */
    dust.helpers.OutTextOrLink =    function (chunk, context, bodies, params) {
        var _value  =   params.value;
        var _res    =   _value.title;

        if(_value.type+'' =='3'){
            _res = '<a target="_blank" href="'+_res+'">'+_value.title+'</a>';
        }
        return chunk.write(_res);
    };
};