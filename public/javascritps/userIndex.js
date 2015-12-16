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
        tagItem :   '<span class="tag label label-info" data="#{name}">#{name}<span data-role="remove"></span></span>',
    };

    var optIndex    =   {
        build       :   function(){
            optIndex.bindEvent();
        },
        bindEvent   :   function(){

            //点击发布文章按钮事件处理
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

                var  tag        =    [];

                var  tagList    =   $('#divTextArticleTag .label-info');
                var  tagListLen =   tagList.length;
                for(var i=0;i<tagListLen;i++){
                    var item = tagList[i];
                    var _name   =   $(item).attr('data');
                    tag.push(_name);
                }

                $.trim($('#divTextArticleTag').text());

                //进行后台处理
                try{

                    var cfg = {
                        url		    :	"/user/article/createTextArticle",
                        data		:	[],
                        method	    :	"POST",
                        start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                        end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                    };



                    //设定需要传递的参数
                    cfg.data.push("title="		    +	title);
                    cfg.data.push("content="		+	content);
                    cfg.data.push("tags="		    +	tag.join('$$$$$'));

                    cfg.start();


                    $.ajax({
                        url         :   cfg.url,
                        method      :   cfg.method,
                        data        :   cfg.data.join('&'),
                        dataType    :   'json',
                        success     :   function(json){
                            try{
                                if(json.result) {
                                    message.msg('发布成功.');
                                    //隐藏发布窗体,并清空发布窗体
                                    $('#release-text').modal('hide');
                                    $('#inputTextTitle').val('');
                                    $('#textareaTextContent').val('');
                                    $("#divTextArticleTag span").remove();
                                    //向主界面增加一个该文章的信息 发布成功,进行推送到关注这个人,通知有新文章发布[待完善]

                                }else{
                                    message.msg('发布失败,' +   json.msg);
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
                        $('#inputTextArticleTag').before($.trim(tagHtmlStr));
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

        }
    };

    return {
        build   :   function(){
            optIndex.build();
        }
    };
})();