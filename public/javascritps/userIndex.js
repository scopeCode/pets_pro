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

    //将要新添加标签 数组
    var  addTag     =   [];

    //标签模板项
    var template    =   {
        tagItem :   '<span class="tag label label-info"> #{name} <span data-role="remove"></span></span>',
    };

    var optIndex    =   {
        build       :   function(){
            optIndex.bindEvent();
        },
        bindEvent   :   function(){
            $('#btnTextArticlePublish').bind('click',function(){
                var title   =   $('#inputTextTitle').val();
                var content =   $('#textareaTextContent').val();

                if(title == ''){
                    message.msg('标题不可为空.');
                    return false;
                }
                if(content == ''){
                    message.msg('内容不可为空.');
                    return false;
                }

                var  tagLen    =    $('#divTextArticleTag .label-info').length;
                //说明有标签
                if(tagLen > 0){

                }

                //进行后台处理


            });

            //输入框绑定回车事件
            $('#inputTextArticleTag').bind('keydown',function(event){
                if(event.keyCode == '13'){
                    event.preventDefault();

                    var  tagVal    =    $('#inputTextArticleTag').val();
                    var  tagLen    =    $('#divTextArticleTag .label-info').length;

                    if(tagVal == ''){
                        message.msg('标签不可为空.');
                        return false;
                    }

                    if(tagLen < 3){
                        var startChar   =   tagVal.substr(0,1);
                        if(startChar!='#'){
                            tagVal = '#' + tagVal;
                        }
                        var tagHtmlStr  =   template.tagItem.format({name:tagVal});
                        $('#inputTextArticleTag').before(tagHtmlStr);
                        $('#inputTextArticleTag').val('');

                        tagLen    =    $('#divTextArticleTag .label-info').length;
                        if(tagLen == 3){
                            $('#inputTextArticleTag').hide();
                        }

                        $('#divTextArticleTag .label-info').bind('click',function(){
                            var _this = $(this);
                            _this.remove();
                            $('#inputTextArticleTag').show();
                        });

                    }else{
                        message.msg('暂时只能添加3个标签.');
                    }
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