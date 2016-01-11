/**
 * 登录页面的处理
 * Created by scj-mo on 2015/12/6.
 */

$(document).ready(function(){
    window.setTimeout(function(){
        userSetting.build();
    },0);
});

//注册页面的对象
var userSetting   =   (function(){

    var optIndex    =   {
        build       :   function(){
            optIndex.bindEvent();
        },
        bindEvent   :   function(){
            //点击编辑按钮的事件
            $("#divUserInfoEdit").on("click",function(){
                $("#divBgPhotoUpload").show();
                $("#divPhotoUpload").show();
                $("#pOldSign").hide();
                $("#inputNewSign").show();
                $("#pOldNick").hide();
                $("#inputNewNick").show();
                $("#divOpt").show();
            });


            //[绑定input_file 的change事件 ]--------------------------//
            $("#inputUploadBgPhoto").on("change",function(){//顶部的上传图片的change事件处理
                var host = 'http://'+window.location.host;
                $("#uploadBgPhoto").ajaxSubmit({
                    url:host+'/upload',
                    cache: false,
                    type: 'post',
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success:function(json){
                        try{
                            if(json.result) {
                                message.msg('上传成功.');
                                var imgUrl  =    "http://7xjik2.com1.z0.glb.clouddn.com/"+json.data.key;
                                $("#imgBgPhoto").attr("src",imgUrl);
                                $("#btnSaveInfo").attr("imgBgPhoto",json.data.key);
                            }else{
                                message.msg('操作失败,' +   json.msg);
                            }
                        }catch(ex){
                            log(ex);
                        }
                    },
                    error:function(res){
                        console.error(res);
                    }
                });
            });


            $("#inputUploadPhoto").on("change",function(){//顶部的上传图片的change事件处理
                var host = 'http://'+window.location.host;
                $("#uploadPhoto").ajaxSubmit({
                    url:host+'/upload',
                    cache: false,
                    type: 'post',
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success:function(json){
                        try{
                            if(json.result) {
                                message.msg('上传成功.');
                                var imgUrl  =    "http://7xjik2.com1.z0.glb.clouddn.com/"+json.data.key;
                                $("#imgPhoto").attr("src",imgUrl);
                                $("#btnSaveInfo").attr("imgPhoto",json.data.key);
                            }else{
                                message.msg('操作失败,' +   json.msg);
                            }
                        }catch(ex){
                            log(ex);
                        }
                    },
                    error:function(res){
                        console.error(res);
                    }
                });
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