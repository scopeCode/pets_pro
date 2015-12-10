/**
 * 登录页面的处理
 * Created by scj-mo on 2015/12/6.
 */

$(document).ready(function(){
    window.setTimeout(function(){
        userIndex.build();
    },0);
});

//注册页面的对象
var userIndex   =   (function(){

    var optIndex    =   {
        build       :   function(){
            optIndex.bindEvent();
        },
        bindEvent   :   function(){

        },
        //验证数据的有效性
        validate      :   function(){

            return true;
        }
    };

    return {
        build   :   function(){
            optIndex.build();
        }
    };
})();