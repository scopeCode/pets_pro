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
            //注册按钮点击事件
            $("#divBtnSubmit").bind("click",function(){
                var userName    =   $.trim($("#inputUserName").val());
                var pwd         =   $.trim($("#inputPwd").val());
                var repwd       =   $.trim($("#inputRePwd").val());

                if(optIndex.validate(userName,pwd,repwd)){

                    try{

                        /*
                         * Ajax请求调用后台接口进行优惠券列表信息读取
                         * */
                        var cfg = {
                            url		    :	"create",
                            data		:	[],
                            method	    :	"POST",
                            start		:	function(){ $("#divLoad").show();},
                            end		    :	function(){ $("#divLoad").hide();}
                        };

                        //设定需要传递的参数
                        cfg.data.push("userName="		+	userName);
                        cfg.data.push("pwd="		    +	pwd);
                        cfg.data.push("repwd="		    +	repwd);

                        cfg.start();
                        $.ajax({
                            url         :   cfg.url,
                            method      :   cfg.method,
                            data        :   cfg.data.join('&'),
                            dataType    :   'json',
                            success     :   function(json){
                                try{
                                    if(json.result) {
                                        message.msg('注册成功.');
                                        window.setTimeout(function(){
                                            window.location.href    =   'v_login';
                                        },2000);
                                    }else{
                                        message.msg('注册失败,' +   json.msg);
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
            if(''   == pwd){
                message.msg('请填写密码.');
                return false;
            }
            if(''   == repwd){
                message.msg('请填写确认密码.');
                return false;
            }
            if(pwd  !=  repwd){
                message.msg('两次密码不一样.');
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