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

    //七牛图片的处理  //TODO 需要对应到界面上 的IMG元素上 , 是否再在找个位置上 处理一下 图片的加载??? 暂时未处理页面
    /**
     * 头像的地址处理
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     * @returns {*}
     * @constructor
     */
    dust.helpers.ImgPhotoFormat   =   function (chunk, context, bodies, params) {
        var url  =   params.value;
        if(url ==""){
            url = "img_normal.png";
        }
        return chunk.write('http://7xjik2.com1.z0.glb.clouddn.com/'+url);
    };
    /**
     * 用户背景图片的处理
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     * @returns {*}
     * @constructor
     */
    dust.helpers.ImgBgPhotoFormat   =   function (chunk, context, bodies, params) {
        var url  =   params.value;
        if(url ==""){
            url = "01.jpg";
        }
        return chunk.write('http://7xjik2.com1.z0.glb.clouddn.com/'+url);
    };
    /**
     * 没有默认图片的图片信息
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     * @returns {*}
     * @constructor
     */
    dust.helpers.ImgCommonFormat   =   function (chunk, context, bodies, params) {
        var url  =   params.value;
        if(url ==""){
            url = "";
        }else{
            url = 'http://7xjik2.com1.z0.glb.clouddn.com/'+url;
        }
        return chunk.write(url);
    };
    /**
     * 签名的公共处理
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     * @returns {*}
     * @constructor
     */
    dust.helpers.SignCommonFormat   =   function (chunk, context, bodies, params) {
        var sign  =   params.value;
        if(sign ==""){
            sign = "这个家伙很懒,什么也没有留下.";
        }
        return chunk.write(sign);
    };

};