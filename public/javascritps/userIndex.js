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
    var  logPage    =   {
        pageNo          :   1,
        pageSize        :   15
    };
    var  page = {
        currentPage :   0,
        limit       :   15
    };

    //标签模板项
    var template    =   {
        tagItem         :   '<span class="tag label label-info" data="#{name}">#{name}<span data-role="remove"></span></span>',
        tagTemp         :   '<a href="#" class="mrm text-muted">#{tagName}</a>',
        uploadImgTemp   :   '<div data="#{key}"><div class="delete" onclick="userIndex.removeImg(this)"> <span class="fui-cross-circle"></span> </div><img src="#{img}" style="width:100%"></div>'
    };

    var optIndex    =   {
        build       :   function(){
            $("#topUl li").removeClass('active');
            $($("#topUl li")[0]).addClass('active');
            page.currentPage = page.currentPage + 1;
            optIndex.bindEvent();
        },
        bindEvent   :   function(){

            $("#btnCommentSubmit").on("click",function(){
                var $this = $(this);
                var articleId   =   $this.attr("articleId");
                var comment     =   $.trim($("#textCommentContent").val());
                if(comment===""){
                    message.msg("评论不可为空.");
                    return false;
                }
                if(comment.length>140){
                    message.msg("评论的长度不可超过140个字符.");
                    return false;
                }
                var userId  =   $.trim($this.attr("userId"));

                //进行后台处理
                try{
                    var cfg = {
                        url		    :	"/user/article/addComment",
                        data		:	[],
                        method	    :	"POST",
                        start		:	function(){ $("#divLoad").show();$("#btnCommentSubmit").addClass('disabled');},
                        end		    :	function(){ $("#divLoad").hide();$("#btnCommentSubmit").removeClass('disabled');}
                    };

                    //设定需要传递的参数
                    cfg.data.push("articleId="		+	articleId);
                    cfg.data.push("comment="		+	comment );
                    cfg.data.push("userId="		    +	userId );

                    cfg.start();

                    $.ajax({
                        url         :   cfg.url,
                        method      :   cfg.method,
                        data        :   cfg.data.join('&'),
                        dataType    :   'json',
                        success     :   function(json){
                            try{
                                if(json.result) {
                                    message.msg('评论成功.');
                                    $("#textCommentContent").val('');
                                    $("#content_body_info_modal").modal("hide");
                                }else{
                                    message.msg('评论失败,' +   json.msg);
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
            /*
            * 下拉加载更多
            * */
            //滚动条在Y轴上的滚动距离
            function getScrollTop(){
                var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
                if(document.body){bodyScrollTop = document.body.scrollTop;}
                if(document.documentElement){
                    documentScrollTop = document.documentElement.scrollTop;
                }scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;return scrollTop;
            };
            //文档的总高度
            function getScrollHeight(){
                var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
                if(document.body){
                    bodyScrollHeight = document.body.scrollHeight;
                }
                if(document.documentElement){
                    documentScrollHeight = document.documentElement.scrollHeight;
                }
                scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
                return scrollHeight;
            };
            //浏览器视口的高度
            function getWindowHeight(){
                var windowHeight = 0;
                if(document.compatMode == "CSS1Compat"){
                    windowHeight = document.documentElement.clientHeight;
                }else{
                    windowHeight = document.body.clientHeight;
                }
                return windowHeight;
            };

            //TODO 下拉加载更多 需要测试
            window.onscroll = function(){
                if(getScrollTop() + getWindowHeight() == getScrollHeight()){

                    //进行后台处理
                    try{
                        var cfg = {
                            url		    :	"/user/article/queryArticleList",
                            data		:	[],
                            method	    :	"POST",
                            other       :{
                                            follow:'<div class="pull-right btn btn-default btn-xs" data="#{userId}" onclick="userIndex.cancelUserFollow(this)">>取消关注</div>',
                                            isShowReprint:'<a class="fui-link mrm" href="#" title="转发" articleId="#{articleId}"  userId="#{userId}" onclick="userIndex.tranlateArticle(this)" ></a>',
                                            isShowHot:'<a class="fui-heart #{isActive} " href="javascript:;;" articleid="#{articleId}" onclick="userIndex.clickSetArticleHot(this)" title="喜欢"></a>',
                            },
                            temp        :   '<li><div class="media">'+
                                '<div class="media-left" onmousemove="userIndex.imgOnmousemove(this)" data="#{userId}" onmouseout="userIndex.imgOnmouseout(this)">'+
                                '<a href="javascript:;;"  class="dropdown-toggle hover-initialized" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">'+
                                '<img src="#{img}" width="64px" height="64px">'+
                                '<div class="person-info" ><div class="person-inner"><div class="person-inner-bg">'+
                                '<img src="#{bgPhoto}"> </div>'+
                                    '<div class="person-inner-top">#{userNick}#{follow}</div><div class="person-inner-body">'+
                                '#{sign}<div class="person-show"><ul data="0">加载中...</ul></div></div></div></div></a></div>'+

                            '<div class="media-body">'+
                                '<div class="list_content ">'+
                            '<div class="content_top">'+
                            '#{userNick}'+
                            '<div class="pull-right text-muted">#{created}</div>'+
                            '</div>'+
                            '<div class="content_body" data-toggle="modal" data-target="#content_body_info" userId="#{userId}"  articleId="#{articleId}" nick="#{userNick}" onclick="userIndex.showCommentModal(this)">  '+
                                '#{title}'+
                            '#{files}'+
                            '<p>#{content}</p>'+
                            '<p class="mbm">'+
                            '#{tags}'+
                            '</p>'+
                            '</div>'+
                            '<div class="content_bottom">'+
                            '<a class="text-muted" href="javascript:;;" articleId="#{articleId}" id="articleId#{articleId}" cnt="#{articleCount}" '+
                            'onclick="userIndex.clickHotCnt(this)">#{articleCount}热度</a>'+
                            '<div class="hot-info" id="articleHotInfo#{articleId}">'+
                            '<div class="hot-inner">'+
                            '<ul id="artileLogList#{articleId}">加载中.....</ul></div></div><div class="bottom_tool">#{isShowReprint}#{isShowHot}</div></div></div></div>',
                            start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                            end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                        };

                        //设定需要传递的参数
                        cfg.data.push("pageNo="             +   0);
                        cfg.data.push("limit="              +   page.limit);

                        cfg.start();

                        $.ajax({
                            url         :   cfg.url,
                            method      :   cfg.method,
                            data        :   cfg.data.join('&'),
                            dataType    :   'json',
                            success     :   function(json){
                                try{
                                    if(json.result) {
                                        var a = [];
                                        var data = json.data;
                                        var len =   data.length;

                                        for(var i=0;i<len;i++){
                                            var item = data[i];

                                            var user  = item.user;
                                            var article = item.article;

                                            var imgList = [];
                                            var imgListData = item.files;
                                            var imgListDataLen = imgListData.length;
                                            for(var j=0;j<imgListDataLen;j++){
                                                imgList.push('<img src="http://7xjik2.com1.z0.glb.clouddn.com/'+imgListData[j].fileHash+'" style="width:100%" />');
                                            }

                                            var tagList = [];
                                            var tagListData =   item.tags;
                                            var taggListDataLen = tagListData.length;
                                            for(var j=0;j<taggListDataLen;j++){
                                                var tagItme = tagListData[j];
                                                var _str = template.tagTemp.format({
                                                    tagName:tagItme.tagName
                                                })
                                                tagList.push(_str);
                                            }

                                            var img = user.info.photo?("http://7xjik2.com1.z0.glb.clouddn.com/" + user.info.photo):
                                                '/img/img_normal.png';

                                            var bgImg   =   user.info.bgPhoto?('http://7xjik2.com1.z0.glb.clouddn.com/'+user.info.bgPhoto):'/img/01.jpg';
                                            var sign    =   user.info.sign ? user.info.sign:'这个家伙很懒,没有东西.';

                                            var title   =  article.title?  '<h6>'+article.title+'</h6>':'';

                                            var isShowReprint = item.isShowReprint?cfg.other.isShowReprint:'';
                                            var isHot       =   item.isShowHot?(cfg.other.isShowHot.format({
                                                articleId:article.id,
                                                isActive:(item.isActiveHot?'active':'')
                                            })):'';

                                            var follow = "";
                                            if(item.isShowCancleFollow){
                                                follow = cfg.other.follow.format({'userId':user.id});
                                            }

                                            var str  = cfg.temp.format({
                                                userId:user.id,
                                                img:img,
                                                bgPhoto:bgImg,
                                                userNick:user.info.userNick,
                                                follow:follow,
                                                sign:sign,
                                                title:title,
                                                files:imgList.join(''),
                                                content:article.content,
                                                created: article.created.substr(0,10),
                                                articleId:article.id,
                                                articleCount:article.count,
                                                isShowReprint:isShowReprint,
                                                isHot:isHot,
                                                tags:tagList.join('')
                                            });
                                            a.push(str);
                                        }

                                        if(a.length > 0){
                                            $('#ulLeftContent').append(a.join(''));
                                            page.currentPage = page.currentPage + 1;
                                        }
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
                }
            };

            //网址图片的操作
            $('#uploadImgUrl').on('change',function(){
                var v = $(this).val();

                var host = 'http://'+window.location.host;
                $("#myFormUploadImgC").ajaxSubmit({
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
                                var htmlStr = template.uploadImgTemp.format({key:json.data.key,img:"http://7xjik2.com1.z0.glb.clouddn.com/"+json.data.key});
                                $('#divImgArticleImgList').append(htmlStr).show();
                                $('#uploadNextDiv').show();
                                $('#divImgArticleContent').show();
                                $('#btnImgArticlePublish').show();
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

            //--上传 网络图片
            $('#uploadImgFromNet').on('click',function(){
                $('#divFileUpload').hide();
                $('#uploadImgUrl').show();
            });

            //提交上传图片文章的处理
            $('#btnImgArticlePublish').on('click',function(){

                //获取信息
                var content =   $("#textareaContent").val();

                var  resTagList =       [];
                var  tag        =    [];

                var  tagList    =   $('#divUploadImgTags .label-info');
                var  tagListLen =   tagList.length;
                for(var i=0;i<tagListLen;i++){
                    var item = tagList[i];
                    var _name   =   $(item).attr('data');
                    resTagList.push(template.tagTemp.format({
                        tagName:_name
                    }));
                    tag.push(_name);
                }

                var filesList   =   $('#divImgArticleImgList').children();
                var filesLen    =   filesList.length;
                var filesArr    =   [];
                if(filesLen == 0){
                    message.msg('没有图片上传啥啊.');
                    return false;
                }
                var fileView =[];
                for(var j=0;j<filesLen;j++){
                    var code = $(filesList[j]).attr('data');
                    filesArr.push(code);
                    fileView.push('<img src="http://7xjik2.com1.z0.glb.clouddn.com/'+code+'" style="width:100%" />');
                }
                //进行后台处理
                try{
                    var cfg = {
                        url		    :	"/user/article/createImgArticle",
                        data		:	[],
                        method	    :	"POST",
                        temp        :   '<li><div class="media">	<div class="media-left">		<a href="javascript:;;"><img src="#{img}" width="64px" height="64px"></a>	</div>	<div class="media-body">		<div class="list_content">			<div class="content_top">				#{nick}				<div class="pull-right text-muted">					#{created}				</div>			</div>			<div class="content_body" data-toggle="modal" data-target="#content_body_info">#{title}#{imgList}				<p>					#{content}				</p>				<p class="mbm">					#{tagList}				</p>			</div>			<div class="content_bottom">				<a class="text-muted" href="javascript:;;" cnt="0" onclick="userIndex.clickHotCnt(this)">0热度</a>				<div class="bottom_tool">				</div>			</div>		</div>	</div></div></li>			',
                        start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                        end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                    };

                    //设定需要传递的参数
                    cfg.data.push("title="		    +	''      );
                    cfg.data.push("content="		+	content );
                    cfg.data.push("type=2"                      );
                    cfg.data.push("tags="		    +	tag.join('$$$$$'));
                    cfg.data.push("files="          +   filesArr.join('$$$$$'));

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

                                    $('#release-photo').modal('hide');

                                    $('#uploadImgUrl').hide();
                                    $('#uploadNextDiv').hide();
                                    $('#uploadNextDivB').hide();
                                    $('#divImgArticleImgList').html('').hide();
                                    $('#divImgArticleContent').hide();
                                    $('#textareaContent').val('');
                                    $('#uploadImgTags').val('').show();
                                    $("#divUploadImgTags span").remove();
                                    $("#btnImgArticlePublish").hide();

                                    $('#divFileUpload').show();

                                    var str  = cfg.temp.format({
                                        img:$('#imgMyPhoto').attr('src'),
                                        nick:$("#aMyNick").text(),
                                        title:'',
                                        imgList:fileView.join(''),
                                        content:content,
                                        created:'刚刚',
                                        tagList:resTagList.join('')
                                    });

                                    $('#ulLeftContentLi').after(str);
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

            //上传图片的标签处理
            $('#uploadImgTags').bind('keydown',function(event){
                if(event.keyCode == '13'){
                    event.preventDefault();

                    var  tagVal    =    $('#uploadImgTags').val();
                    var  tagLen    =    $('#divUploadImgTags .label-info').length;

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

                        $('#uploadImgTags').before($.trim(tagHtmlStr));
                        $('#uploadImgTags').val('');

                        tagLen    =    $('#divUploadImgTags .label-info').length;
                        if(tagLen == 3){
                            $('#uploadImgTags').hide();
                        }

                        $('#divUploadImgTags .label-info').bind('click',function(){
                            var _this = $(this);
                            _this.remove();
                            $('#uploadImgTags').show();
                        });

                    }else{
                        message.msg('暂时只能添加3个标签.');
                    }
                }
            });
            //[绑定input_file 的change事件 ]--------------------------//
            $("#inputBtnUploadImgA").on("change",function(){//顶部的上传图片的change事件处理

                var host = 'http://'+window.location.host;
                $("#myFormUploadImgA").ajaxSubmit({
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
                                $('#divFileUpload').hide();
                                var htmlStr = template.uploadImgTemp.format({key:json.data.key,img:"http://7xjik2.com1.z0.glb.clouddn.com/"+json.data.key});
                                $('#divImgArticleImgList').append(htmlStr).show();
                                $('#uploadNextDiv').show();
                                $('#divImgArticleContent').show();
                                $('#btnImgArticlePublish').show();
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

            $("#inputBtnUploadImgB").on("change",function(){//顶部的上传图片的change事件处理
                var host = 'http://'+window.location.host;
                $("#myFormUploadImgB").ajaxSubmit({
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
                                var htmlStr = template.uploadImgTemp.format({key:json.data.key,img:"http://7xjik2.com1.z0.glb.clouddn.com/"+json.data.key});
                                $('#divImgArticleImgList').append(htmlStr).show();
                                $('#uploadNextDiv').show();
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
            //--------------------------//

            //链接文章发布框的事件的绑定
            $('#inputLinkArticleValue').bind('input propertychange', function() {
                var _this = this;
                var $parent = $(_this).parent();
                var url = $(_this).val();
                if(!url){
                    return false;
                }
                //进行后台处理
                try{

                    var cfg = {
                        url		    :	"/user/link/getTitle",
                        data		:	[],
                        method	    :	"POST",
                        temp        :   '<a class="form-control input-lg" target="_blank" href="#{href}">#{content}</a>',
                        start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                        end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                    };
                    cfg.data.push('url=' +   url);
                    //设定需要传递的参数
                    cfg.start();
                    $.ajax({
                        url         :   cfg.url,
                        method      :   cfg.method,
                        data        :   cfg.data.join('&'),
                        dataType    :   'json',
                        success     :   function(json){
                            try{
                                if(json.result) {
                                    var  title = json.data;
                                    $('#inputLinkArticleValue').hide().val('');

                                    $parent.prepend(cfg.temp.format({
                                        'href':url,
                                        'content':title
                                    }));

                                    $('#btnLinkArticlePublish').attr('urlTitle',title).attr('url',url);
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

            });

            //点击发布 链接的文章的处理
            $('#btnLinkArticlePublish').bind('click',function(){

                var link = $.trim($('#btnLinkArticlePublish').attr('url'));
                if(link == ''){
                    message.msg('链接地址不可为空.');
                    return false;
                }

                var res = /(https?|ftp|mms):\/\/([A-z0-9]+[_\-]?[A-z0-9]+\.)*[A-z0-9]+\-?[A-z0-9]+\.[A-z]{2,}(\/.*)*\/?/.test(link);
                if(!res){
                    message.msg('链接地址不合法.');
                    return false;
                }

                var title   = $('#btnLinkArticlePublish').attr('urlTitle');
                var content = $('#textareaLinkArticleContent').val();

                var  resTagList =       [];
                var  tag        =    [];

                var  tagList    =   $('#divLinkArticleTag .label-info');
                var  tagListLen =   tagList.length;
                for(var i=0;i<tagListLen;i++){
                    var item = tagList[i];
                    var _name   =   $(item).attr('data');
                    resTagList.push(template.tagTemp.format({
                        tagName:_name
                    }));
                    tag.push(_name);
                }

                //进行后台处理
                try{
                    var cfg = {
                        url		    :	"/user/article/createLinkArticle",
                        data		:	[],
                        method	    :	"POST",
                        tempLink    :   '<a title="#{data}" target="_blank" href="#{href}">#{content}</a>',
                        temp        :   '<li><div class="media"><div class="media-left"><a href="javascript:;;"><img src="#{img}" width="64px" height="64px"></a></div><div class="media-body"><div class="list_content"><div class="content_top">#{nick}<div class="pull-right text-muted">#{created}</div></div><div class="content_body" data-toggle="modal" data-target="#content_body_info"><h6>#{title}</h6><p>#{content}</p><p class="mbm" >#{tagList}</p></div><div class="content_bottom"><a class="text-muted" href="javascript:;;" cnt="0" onclick="userIndex.clickHotCnt(this)">0热度</a><div class="bottom_tool"></div></div></div></div></div></li>',
                        start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                        end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                    };

                    var _title = cfg.tempLink.format({content:title, href:link,data:title});
                    //设定需要传递的参数
                    cfg.data.push("title="		    +	_title  );
                    cfg.data.push("content="		+	content );
                    cfg.data.push("type=3"                      );
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
                                    $('#release-link').modal('hide');
                                    $('#inputLinkArticleValue').val('');
                                    $('#textareaLinkArticleContent').val('');
                                    $("#divLinkArticleTag span").remove();
                                    //向主界面增加一个该文章的信息 发布成功,进行推送到关注这个人,通知有新文章发布[待完善]

                                    var str  = cfg.temp.format({
                                        img:$('#imgMyPhoto').attr('src'),
                                        nick:$("#aMyNick").text(),
                                        title:_title,
                                        content:content,
                                        created:'刚刚',
                                        tagList:resTagList.join('')
                                    });

                                    $('#ulLeftContentLi').after(str);
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

                var  resTagList =       [];
                var  tag        =    [];

                var  tagList    =   $('#divTextArticleTag .label-info');
                var  tagListLen =   tagList.length;
                for(var i=0;i<tagListLen;i++){
                    var item = tagList[i];
                    var _name   =   $(item).attr('data');
                    resTagList.push(template.tagTemp.format({
                        tagName:_name
                    }));
                    tag.push(_name);
                }

                //进行后台处理
                try{

                    var cfg = {
                        url		    :	"/user/article/createTextArticle",
                        data		:	[],
                        method	    :	"POST",

                        temp        :   '<li><div class="media"><div class="media-left"><a href="javascript:;;"><img src="#{img}" width="64px" height="64px"></a></div><div class="media-body"><div class="list_content"><div class="content_top">#{nick}<div class="pull-right text-muted">#{created}</div></div><div class="content_body" data-toggle="modal" data-target="#content_body_info"><h6>#{title}</h6><p>#{content}</p><p class="mbm" >#{tagList}</p></div><div class="content_bottom"><a class="text-muted" href="javascript:;;" cnt="0" onclick="userIndex.clickHotCnt(this)">0热度</a><div class="bottom_tool"></div></div></div></div></div></li>',
                        start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                        end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                    };



                    //设定需要传递的参数
                    cfg.data.push("title="		    +	title);
                    cfg.data.push("content="		+	content);
                    cfg.data.push("type=1"		                );
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

                                    var str  = cfg.temp.format({
                                        img:$('#imgMyPhoto').attr('src'),
                                        nick:$("#aMyNick").text(),
                                        title:title,
                                        content:content,
                                        created:'刚刚',
                                        tagList:resTagList.join('')
                                    });

                                    $('#ulLeftContentLi').after(str);
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
            $('#inputLinkArticleTag').bind('keydown',function(event){
                if(event.keyCode == '13'){
                    event.preventDefault();

                    var  tagVal    =    $('#inputLinkArticleTag').val();
                    var  tagLen    =    $('#divLinkArticleTag .label-info').length;

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

                        $('#inputLinkArticleTag').before($.trim(tagHtmlStr));
                        $('#inputLinkArticleTag').val('');

                        tagLen    =    $('#divLinkArticleTag .label-info').length;
                        if(tagLen == 3){
                            $('#inputLinkArticleTag').hide();
                        }

                        $('#divLinkArticleTag .label-info').bind('click',function(){
                            var _this = $(this);
                            _this.remove();
                            $('#inputLinkArticleTag').show();
                        });

                    }else{
                        message.msg('暂时只能添加3个标签.');
                    }
                }
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
        queryArticleList:function(limit,pageSize){
//进行后台处理
            try{

                var cfg = {
                    url		    :	"/user/article/createTextArticle",
                    data		:	[],
                    method	    :	"POST",
                    temp        :   '',
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

                            }else{
                                message.msg('读取信息失败,' +   json.msg);
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
        query:function(){
            //进行后台处理
            try{
                //TODO 这个位置怎么分页
                $("#Pagination").hide();
                var cfg = {
                    url		    :	"/user/article/queryArticleLogByArticleId",
                    data		:	[],
                    method	    :	"POST",
                    temp        :  '<tr><td><div class="media"><div class="media-left"><a href="javascript:void(0);"> <img src="#{img}" width="36px" height="36px"></a></div><div class="media-body">#{content}</div><div class="media-right"><a href="javascript:void(0);" class="btn-box-green" title="关注"><span class="fui-plus"></span></a></div></div></td></tr>',
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };

                //设定需要传递的参数
                cfg.data.push("articleId="  +	$("#dataList").attr('data'));
                cfg.data.push("pageNo="      +	logPage.pageNo - 1);
                cfg.data.push("pageSize="   +	logPage.pageSize);

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

                                var len         = json.data.list.length;
                                var totalCnt    = json.data.totalCnt;
                                var a = [];
                                for(var i=0;i<len;i++){
                                    var item    = json.data.list[i].logs;
                                    var info    = json.data.list[i].info;

                                    /*commitContent: null
                                     content: "dq_as点赞咯."
                                     created: "2016-01-19T13:47:21.000Z"
                                     fromUserId: 1
                                     id: 8
                                     status: true
                                     type: 1
                                     userId: 1*/

                                    var str = cfg.temp.format({
                                        'img':'http://7xjik2.com1.z0.glb.clouddn.com/'+info.photo,
                                        "content":item.content
                                    });
                                    a.push(str);
                                }
                                $("#dataList").html(a.join(''));

                                $("#Pagination").show();
                                $("#Pagination").pagination(totalCnt, {
                                    callback :  optIndex.pageSelectCallBack,
                                    prev_text : "上一页",
                                    next_text : "下一页",
                                    items_per_page : logPage.pageSize,
                                    num_display_entries : 6,
                                    current_page : logPage.pageNo - 1,
                                    num_edge_entries : 2
                                });
                                $("#user_hot_modal").modal("show");
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
        clickHotCnt:function(_this){
            var item = $(_this);
            var articleId = item.attr('articleId');
            var cnt = item.attr('cnt');
            //--远程读取数据信息 倒叙排列
            if(cnt == '0'){
                message.msg('0数你还点个啥?');
                return false;
            }
            $("#dataList").attr('data',articleId);
            optIndex.query();
        },
        pageSelectCallBack:function(pageNo, jq){
            logPage.currentPage = pageNo + 1;
            optIndex.query();
        },//pageSelectCallBack end
        imgOnmousemove:function(_this){
            (function(_this){
                var $this = $(_this);
                var $ul = $($this.find('ul')[0]);
                if($this.attr('data')!=''){
                    if(!$(_this).hasClass('open') && $ul.attr('data')==0){
                        $ul.attr('data')==1;
                        optIndex.queryTop3Article(_this);
                    }
                }else{
                    $ul.html('');
                }
            })(_this);
            $(_this).addClass('open');
        },
        imgOnmouseout:function(_this){
            $(_this).removeClass('open');
        },
        clickSetArticleHot:function(_this){
            var item  = $(_this);
            var isActive    =   item.hasClass('active');
            var opt         =   isActive ? "2" : "1"; //1为加 2为减
            var url         =   isActive ? "/user/article/articleDescHot" : "/user/article/articleAddHot"; //1为加 2为减
            var articleId   =   item.attr('articleId');

            //进行后台处理
            try{

                var cfg = {
                    url		    :	url,
                    data		:	[],
                    method	    :	"POST",
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };


                //设定需要传递的参数
                cfg.data.push("articleId="		    +	articleId);

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
        },
        tranlateArticle:function(_this){
            var item  = $(_this);
            var articleId   =   item.attr('articleId');
            var userId      =   item.attr('userId');

            //进行后台处理
            try{

                var cfg = {
                    url		    :	'/user/article/articleReprint',
                    data		:	[],
                    method	    :	"POST",
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };

                //设定需要传递的参数
                cfg.data.push("articleId="		    +	articleId);
                cfg.data.push("userId="		        +	userId);

                cfg.start();

                $.ajax({
                    url         :   cfg.url,
                    method      :   cfg.method,
                    data        :   cfg.data.join('&'),
                    dataType    :   'json',
                    success     :   function(json){//将关注的这条记录 变更转发
                        try{
                            if(json.result) {
                                message.msg('操作成功.');
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
        },
        followUser:function(_this){
            var item            = $(_this);
            var followUserId    =   item.attr('data');

            //进行后台处理
            try{

                var cfg = {
                    url		    :	'/user/follow',
                    data		:	[],
                    method	    :	"POST",
                    temp        :   {
                            'followed':'<div class="btn-box" style="width: 47px;">已关注</div>',
                            'noFollow':''
                    },
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };

                //设定需要传递的参数
                cfg.data.push("followUserId="		    +	followUserId);

                cfg.start();

                $.ajax({
                    url         :   cfg.url,
                    method      :   cfg.method,
                    data        :   cfg.data.join('&'),
                    dataType    :   'json',
                    success     :   function(json){//将关注的这条记录 变更转发
                        try{
                            if(json.result) {
                                message.msg('操作成功.');
                                //处理所有的 需要关注的地方 及 头像处 取消关注的按钮
                                $(item.parent()).html(cfg.temp.followed);
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
        },//end
        cancelUserFollow:function(_this){
            var item            = $(_this);
            var followUserId    =   item.attr('data');

            //进行后台处理
            try{

                var cfg = {
                    url		    :	'/user/cancelFollow',
                    data		:	[],
                    method	    :	"POST",
                    temp        :   {
                        'followed':'<div class="btn-box" style="width: 47px;">已关注</div>',
                        'noFollow':''
                    },
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };

                //设定需要传递的参数
                cfg.data.push("followUserId="		    +	followUserId);

                cfg.start();

                $.ajax({
                    url         :   cfg.url,
                    method      :   cfg.method,
                    data        :   cfg.data.join('&'),
                    dataType    :   'json',
                    success     :   function(json){//将关注的这条记录 变更转发
                        try{
                            if(json.result) {
                                message.msg('操作成功.');
                                //这个时候  要还原 一下 点击 关注 的按钮 有 2 个地方需要注意的  1: 点击本身 2： 头像上面的按钮
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
        },//end
        queryTop3Article:function(_this){
            var item      = $(_this);
            var userId    =   item.attr('data');

            //进行后台处理
            try{

                var cfg = {
                    url		    :	'/user/getTop3ArticleFile',
                    data		:	[],
                    method	    :	"POST",
                    temp        :   '<li data="#{articleId}"><img src="http://7xjik2.com1.z0.glb.clouddn.com/#{imgUrl}"></li>',
                    start		:	function(){ $("#divLoad").show();$("#divBtnSubmit").addClass('disabled');},
                    end		    :	function(){ $("#divLoad").hide();$("#divBtnSubmit").removeClass('disabled');}
                };

                //设定需要传递的参数
                cfg.data.push("userId="		    +	userId);

                cfg.start();

                $.ajax({
                    url         :   cfg.url,
                    method      :   cfg.method,
                    data        :   cfg.data.join('&'),
                    dataType    :   'json',
                    success     :   function(json){//将关注的这条记录 变更转发
                        try{
                            if(json.result) {
                                var data = json.data;
                                var len = data.length;

                                var $thisUl = $($(_this).find('ul')[0]);

                                if(len>0){
                                    var a = [];
                                    for(var i=0;i<len;i++){
                                        var item = data[i];
                                        if(item.file){
                                            a.push(cfg.temp.format({imgUrl:item.file.fileHash,articleId:item.article.id}));
                                        }
                                    }
                                    $thisUl.html(a.join(''));
                                }else{
                                    $thisUl.html('');
                                }
                                $thisUl.attr('data','0');
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
        },//end
        removeImg:function(_this){
            var parent = $(_this).parent();
            $(parent).remove();

            var len = $('#divImgArticleImgList').children().length;
            if(len == 0){
                $('#divFileUpload').show();
                $('#uploadImgUrl').hide();
                $('#uploadNextDiv').hide();
                $('#uploadNextDivB').hide();
                $('#divImgArticleImgList').hide();
                $('#divImgArticleContent').hide();
                $('#btnImgArticlePublish').hide();
            }
        },
        showCommentModal:function(_this){
            var ele = $(_this);
            var nick = ele.attr("nick");
            $("#divUserNick").html(nick);

            var opt     =   ele.find('a.f_opt');
            var optLen  =   opt.length;
            if(optLen > 0){
                var str = [];
                for(var i=0;i<optLen;i++){
                    var item = opt[i].outerHTML;
                    str.push(item);
                }
                $("#divUserInfoOpt").html(str.join(''));
            }

            var tags    =   ele.find("a.f_tags");
            var tagsLen =   tags.length;
            if(tagsLen>0){
                var str = [];
                for(var i=0;i<tagsLen;i++){
                    var item = tags[i].outerHTML;
                    str.push(item);
                }
                $("#pTags").html(str.join(''));
            }

            var imgs    =   ele.find("img.f_img");
            var imgsLen =   imgs.length;
            if(imgsLen>0){
                var str = [];
                for(var i=0;i<imgsLen;i++){
                    var item = imgs[i].outerHTML;
                    str.push(item);
                }
                $("#divImgList").html(str.join(''));
            }

            var content = ele.find("p.f_content");
            if(content.length>0){
                $("#pContent").html(content[0].innerHTML);
            }

            var title   =   ele.find('h6.f_title');
            if(title.length>0){
                $("#divTitle").html(title[0].outerHTML);
            }

            $("#btnCommentSubmit").attr("userId",ele.attr("userId"));
            $("#btnCommentSubmit").attr("articleId",ele.attr("articleId"));

            $("#content_body_info_modal").modal("show");
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
            optIndex.tranlateArticle(_this);
        },
        imgOnmousemove:function(_this){
            optIndex.imgOnmousemove(_this);
        },
        imgOnmouseout:function(_this){
            optIndex.imgOnmouseout(_this);
        },
        followUser:function(_this){
            optIndex.followUser(_this);
        },
        cancelUserFollow:function(_this){
            optIndex.cancelUserFollow(_this);
        },
        queryTop3Article:function(_this){
            optIndex.queryTop3Article(_this);
        },
        removeImg:function(_this){
            optIndex.removeImg(_this);
        },
        showCommentModal:function(_this){
            optIndex.showCommentModal(_this);
        }
    };
})();