/**
 * 用户个人页面的js处理
 * Created by scj-mo on 2015/12/11.
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

            //输入框绑定回车事件
            $('#inputTextArticleTag').bind('keydown',function(event){
                if(event.keyCode == '13'){
                    event.preventDefault();

                    console.log($('#inputTextArticleTag').val());

                }
            });


            //登录按钮点击事件
            $("#divBtnSubmit").bind("click",function(){
                var userName    =   $.trim($("#inputUserName").val());
                var pwd         =   $.trim($("#inputPwd").val());

                if(optIndex.validate(userName,pwd)){

                    try{

                        var cfg = {
                            url		    :	"login",
                            data		:	[],
                            method	    :	"POST",
                            start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                            end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                        };

                        //设定需要传递的参数
                        cfg.data.push("userName="		+	userName);
                        cfg.data.push("pwd="		    +	pwd);

                        cfg.start();


                        $.ajax({
                            url         :   cfg.url,
                            method      :   cfg.method,
                            data        :   cfg.data.join('&'),
                            dataType    :   'json',
                            success     :   function(json){
                                try{
                                    if(json.result) {
                                        message.msg('登录成功.');
                                        window.setTimeout(function(){
                                            window.location.href    =   '/';
                                        },2000);
                                    }else{
                                        message.msg('登录失败,' +   json.msg);
                                    }
                                }catch(ex){
                                    log(ex);
                                }
                                finally{
                                    cfg.end();
                                }
                            },
                            error       :   function(xhr){
                                try{
                                    ajaxFailure(xhr);
                                }catch(ex){
                                    log(ex);
                                }
                                finally{
                                    cfg.end();
                                }
                            }
                        });
                    }catch(ex){
                        log(ex);
                    }//catch(ex) end

                }
            });
        }
    };

    return {
        build   :   function(){
            optIndex.build();
        }
    };
})();