/**
 * 登录页面的处理
 * Created by scj-mo on 2015/12/6.
 */

$(document).ready(function(){
    window.setTimeout(function(){
        userMessage.build();
    },0);
});

//消息的页面处理操作
var userMessage   =   (function(){

    var li    =  '<li><div class="media"><div class="media-left"><a href="javascript:;;">'+
            '<img class="media-object" data-src="holder.js/64x64" alt="64x64" src="#{img}" data-holder-rendered="true" style="width: 64px; height: 64px;"></a></div>'+
            '<div class="media-body"><p class="media-heading">#{content}</p>#{commitContent}</div><div class="media-right text-muted">#{created}</div></div></li>'

    var optIndex    =   {
        build       :   function(){
            optIndex.bindEvent();
            optIndex.msg.query();
        },
        bindEvent   :   function(){

            //TAB切换时 如果 没有信息则 读取 否则不读取
            $("#msg-tab").on("click",function(){
                var isHasActive     =    $(this).hasClass("active");
                var isHasItem       =    $("#ulMessageList").children().length >0? true:false;
                if(!isHasActive && !isHasItem){
                    optIndex.msg.query();
                }
            });
            $("#profile-tab").on("click",function(){
                var isHasActive     =    $(this).hasClass("active");
                var isHasItem       =    $("#ulProfileList").children().length >0? true:false;
                if(!isHasActive && !isHasItem){
                    optIndex.profile.query();
                }
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
            window.onscroll = function() {
                if (getScrollTop() + getWindowHeight() == getScrollHeight()) {
                    //定位到 指定的 tab 下的操作
                    var  type   =    $("#myTabs li.active a").attr('id');
                    if(type == 'profile-tab'){
                        optIndex.profile.query();
                    }else if(type == 'msg-tab'){
                        optIndex.msg.query();
                    }
                }
            };
        },
        msg:{
            page:{
                pageNo  :   0,
                pageSize:   15
            },
            query   :   function(){
                //进行后台处理
                try{
                    var cfg = {
                        url		    :	"/user/message/query",
                        data		:	[],
                        method	    :	"POST",
                        start		:	function(){ $("#divLoad").show();},
                        end		    :	function(){ $("#divLoad").hide();}
                    };

                    //设定需要传递的参数
                    cfg.data.push("limit="		    +	optIndex.msg.page.pageSize);
                    cfg.data.push("pageno="		    +	optIndex.msg.page.pageNo);
                    cfg.data.push("type="		    +	'1');

                    //TODO 需要 注册时,默认给一个 背景图片和 默认的头像的处理
                    cfg.start();

                    $.ajax({
                        url         :   cfg.url,
                        method      :   cfg.method,
                        data        :   cfg.data.join('&'),
                        dataType    :   'json',
                        success     :   function(json){
                            try{
                                if(json.result) {
                                    var data = json.data;
                                    var len =   data.length;
                                    var a = [];
                                    for(var i=0;i<len;i++){
                                        var item = data[i];
                                        var log     =    item.log;
                                        var info    =    item.info;

                                        a.push(li.format({
                                            img:'http://7xjik2.com1.z0.glb.clouddn.com/'+info.photo,
                                            content:log.content,
                                            commitContent:log.commitContent,
                                            created:'----'
                                        }));
                                    }

                                    if(a.length > 0){
                                        $("#ulMessageList").append(a.join(''));
                                        optIndex.msg.page.pageNo = optIndex.msg.page.pageNo + 1;
                                    }else{
                                        if(optIndex.msg.page.pageNo == 0){
                                            message.msg("没有数据");
                                        }
                                    }
                                }else{
                                    message.msg('失败,' +   json.msg);
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
        },
        profile:{
            page:{
                pageNo  :   0,
                pageSize:   15
            },
            query:  function(){
                //进行后台处理
                try{
                    var cfg = {
                        url		    :	"/user/message/query",
                        data		:	[],
                        method	    :	"POST",
                        start		:	function(){ $("#divLoad").show();},
                        end		    :	function(){ $("#divLoad").hide();}
                    };

                    //设定需要传递的参数
                    cfg.data.push("limit="		    +	optIndex.profile.page.pageSize);
                    cfg.data.push("pageno="		    +	optIndex.profile.page.pageNo);
                    cfg.data.push("type="		    +	'2');

                    //TODO 需要 注册时,默认给一个 背景图片和 默认的头像的处理
                    cfg.start();

                    $.ajax({
                        url         :   cfg.url,
                        method      :   cfg.method,
                        data        :   cfg.data.join('&'),
                        dataType    :   'json',
                        success     :   function(json){
                            try{
                                if(json.result) {
                                    var data = json.data;
                                    var len =   data.length;
                                    var a = [];
                                    for(var i=0;i<len;i++){
                                        var item = data[i];
                                        var log     =    item.log;
                                        var info    =    item.info;

                                        a.push(li.format({
                                            img:'http://7xjik2.com1.z0.glb.clouddn.com/'+info.photo,
                                            content:log.content,
                                            commitContent:"",
                                            created:formatDate(log.created)
                                        }));
                                    }

                                    if(a.length > 0){
                                        $("#ulProfileList").append(a.join(''));
                                        optIndex.profile.page.pageNo = optIndex.profile.page.pageNo + 1;
                                    }else{
                                        if(optIndex.profile.page.pageNo == 0){
                                            message.msg("没有数据");
                                        }
                                    }
                                }else{
                                    message.msg('失败,' +   json.msg);
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
        }
    };

    return {
        build   :   function(){
            optIndex.build();
        }
    };
})();