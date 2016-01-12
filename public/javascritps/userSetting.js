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

            //保存按钮 点击事件

            $("#btnSaveInfo").on("click",function(){
                var $this       =   $(this);
                var bgPhoto     =   $this.attr("imgbgphoto");
                var photo       =   $this.attr('imgphoto');

                var sign        =   $("#inputNewSign").val();
                var nick        =   $("#inputNewNick").val();


                if(optIndex.validate(sign,nick)){
                    //进行后台处理
                    try{
                        var cfg = {
                            url		    :	"/user/savesetting",
                            data		:	[],
                            method	    :	"POST",
                            start		:	function(){ $("#divLoad").show();$("#btnSaveInfo").addClass('disabled');},
                            end		    :	function(){ $("#divLoad").hide();$("#btnSaveInfo").removeClass('disabled');}
                        };

                        //设定需要传递的参数
                        cfg.data.push("bgPhoto="		+	bgPhoto);
                        cfg.data.push("photo="		    +	photo);
                        cfg.data.push("sign="		    +	sign);
                        cfg.data.push("nick="		    +	nick);

                        cfg.start();

                        $.ajax({
                            url         :   cfg.url,
                            method      :   cfg.method,
                            data        :   cfg.data.join('&'),
                            dataType    :   'json',
                            success     :   function(json){
                                try{
                                    if(json.result) {
                                        //--界面赋值
                                        $("#pOldNick").html(nick);
                                        $("#pOldSign").html(sign);

                                        $("#divBgPhotoUpload").hide();
                                        $("#divPhotoUpload").hide();
                                        $("#inputNewNick").hide();
                                        $("#divOpt").hide();
                                        $("#inputNewSign").hide();

                                        $("#pOldSign").show();
                                        $("#pOldNick").show();

                                        message.msg('操作成功.');
                                    }else{
                                        message.msg('操作失败,' +   json.msg);
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
                };

            });

        },
        //验证数据的有效性
        validate      :   function(sign,nick){
            if(''   == sign){
                message.msg('请填写签名.');
                return false;
            }
            if(''   == nick){
                message.msg('请填写昵称.');
                return false;
            }
            var nickLen  =   nick.length;
            if(nickLen>10){
                message.msg('昵称的长度过长.最大长度10.');
                return false;
            }
            if(sign.length > 140){
                message.msg('签名的长度过长.最大长度140.');
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