/**
 * dustJs 公共类的处理
 * Created by WG on 2015/12/10.
 */
var EventProxy      =   require('eventProxy');
var articleProxy    =   require('../proxy/article');


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
        date    =   timestamp.getDate();
        year    =   timestamp.getFullYear();
        hour    =   timestamp.getHours();
        min     =   timestamp.getMinutes();
        second  =   timestamp.getSeconds();

        return chunk.write(year + '/' + month + '/' + date +' ' + hour+':'+min+':'+second);
    };

    /**
     *
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     */
    dust.helpers.IsShowHot =    function (chunk, context, bodies, params) {
        var _value  =   params.value;
        var _uid    =   params.uid;
        var _res    =   "";
        var _len    =   _value.length;

        for(var i=0;i<_len;i++){
            var userId = _value[i].userId;
            if(userId == _uid){
                _res = "active";
                break;
            }
        }
        return chunk.write(_res);
    };

    dust.helpers.OutTextOrLink =    function (chunk, context, bodies, params) {
        var _value  =   params.value;
        var _res    =   _value.title;

        if(_value.type+'' =='3'){
            _res = '<a target="_blank" href="'+_res+'">'+_value.title+'</a>';
        }
        return chunk.write(_res);
    };

};