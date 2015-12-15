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
            year;

        timestamp = new Date(value);
        month = timestamp.getMonth() + 1;
        date = timestamp.getDate();
        year = timestamp.getFullYear();

        return chunk.write(year + '/' + month + '/' + date);
    };

    /**
     * 获取文章的图片信息
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     * @returns {*}
     */
    dust.helpers.getArticleFile = function (chunk, context, bodies, params) {
        var type        =   params.articleType;
        var articleId   =   params.articleId;
        type = 2;
        if(type == 1){
            return chunk.write('') ;
        }
        (function(chunk,articleId){
            articleProxy.querArtileFiles(articleId,function(data){
                (function(chunk){
                    var filesArr = [];
                    var len = data.length;
                    for(var i=0;i<len;i++){
                        var file = data[i];
                        filesArr.push('<img src="http://7xjik2.com1.z0.glb.clouddn.com/'+file.fileHash+'" style="width:100%">');
                    }
                    return chunk.write(filesArr.join(''));
                })(chunk);
            });
        })(chunk,articleId);
    };

    /**
     * 获取文章的标签信息
     * @param chunk
     * @param context
     * @param bodies
     * @param params
     */
    dust.helpers.trim =    function (chunk, context, bodies, params) {
        var _value   =   params.value;
        _value  =  _value.replaceAll(" ","");
        return chunk.write(_value);
    };

};