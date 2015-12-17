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

        },//build end
        clickHotCnt:function(_this){
            var item = $(_this);
            var articleId = item.attr('articleId');
            $('#articleHotInfo'+articleId).show();
            $('body').addClass('modal-open');
            //--远程读取数据信息 倒叙排列

            //进行后台处理
            try{

                var cfg = {
                    url		    :	"/user/article/queryArticleLogByArticleId",
                    page        :{
                        limit   :   0,
                        pageSize:   15
                    },
                    data		:	[],
                    method	    :	"POST",
                    temp        :  '<li><div class="media"><div class="media-left"> <a href="javascript:;;"> <img src="#{img}" width="36px" height="36px"> </a> </div><div class="media-body"> #{content} </div><div class="media-right"> <a href="javascript:;;" data="#{userId}" class="btn-box-green" title="关注"><span class="fui-plus"></span></a> </div></div></li>',
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };

                //设定需要传递的参数
                cfg.data.push("articleId="+	articleId);
                cfg.data.push("limit="+	cfg.page.limit);
                cfg.data.push("pageSize="+	cfg.page.pageSize);

                cfg.start();

                $.ajax({
                    url         :   cfg.url,
                    method      :   cfg.method,
                    data        :   cfg.data.join('&'),
                    dataType    :   'json',
                    success     :   function(json){
                        try{
                            if(json.result) {
                                console.log(json.data);

                                var len = json.data.length;
                                for(var i=0;i<len;i++){
                                    var item = json.data[i];

                                    var articleId = item.ARTICLE_ID,
                                        bgPhoto=item.BG_PHOTO,
                                        content=item.CONTENT,
                                        created=item.CREATED,
                                        nick=item.NICK,
                                        photo=item.PHOTO;
                    ///img/img_normal.png
                                }

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

        },
        clickSetArticleHot:function(_this){
            var item  = $(_this);
            var isActive    =   item.hasClass('active');
            var opt         =   isActive ? "2" : "1"; //1为加 2为减
            var articleId   =   item.attr('articleId');

            //进行后台处理
            try{

                var cfg = {
                    url		    :	"/user/article/updateArticleHotCnt",
                    data		:	[],
                    method	    :	"POST",
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };


                //设定需要传递的参数
                cfg.data.push("articleId="		    +	articleId);
                cfg.data.push("optType="		    +	opt);

                cfg.start();

                $.ajax({
                    url         :   cfg.url,
                    method      :   cfg.method,
                    data        :   cfg.data.join('&'),
                    dataType    :   'json',
                    success     :   function(json){
                        try{
                            if(json.result) {
                                message.msg('操作成功.');
                                var cnt =parseInt($('#articleId'+articleId).attr('cnt'));
                                switch (opt){
                                    case "1":{
                                        item.addClass('active');
                                        //加1
                                        var _cnt = (cnt + 1) + '';
                                        $('#articleId'+articleId).html( _cnt    + '热度').attr('cnt',_cnt);
                                    }break;
                                    case "2":{
                                        item.removeClass('active');
                                        //减去1
                                        var _cnt = (cnt - 1) + '';
                                        $('#articleId'+articleId).html((cnt - 1) + '热度').attr('cnt',_cnt);
                                    }break;
                                }
                            }else{
                                message.msg('操作失败:' +   json.msg);
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
    };

    return {
        build   :   function(){
            optIndex.build();
        },
        clickHotCnt:function(_this){
            optIndex.clickHotCnt(_this);
        },
        clickSetArticleHot:function(_this){
            optIndex.clickSetArticleHot(_this);
        },
        tranlateArticle:function(_this){
            //自己不能转发自己的文章直接屏蔽掉
        }
    };
})();