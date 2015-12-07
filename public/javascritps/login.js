/**
 * 登录页面的处理
 * Created by scj-mo on 2015/12/6.
 */

$(document).ready(function(){
    window.setTimeout(function(){
        loginIndex.build();
    },0);
});

//注册页面的对象
var loginIndex   =   (function(){

    var optIndex    =   {
        build       :   function(){
            optIndex.bindEvent();
        },
        bindEvent   :   function(){
            //按钮绑定回车事件
            $('body').bind('keydown',function(event){
                if(event.keyCode == '13'){
                    event.preventDefault();
                    $("#divBtnSubmit").click();
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
        },
        //验证数据的有效性
        validate      :   function(userName,pwd,repwd){
            if(''   == userName){
                message.msg('请填写用户名.');
                return false;
            }
            if(!mobileRule.test(userName)){
                message.msg('手机号格式不正确.');
                return false;
            }
            if(''   == pwd){
                message.msg('请填写密码.');
                return false;
            }
            var pwdLen  =   pwd.length;
            if(pwdLen<6){
                message.msg('密码的长度过短.最小长度6.');
                return false;
            }
            return true;
        }
    };

    return {
        build   :   function(){
            optIndex.build();
        }
    };
})();