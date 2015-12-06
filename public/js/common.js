/**
 * Created by scj-mo on 2015/12/6.
 */
var message=(function(){var timer=null;var id="$messageId";var cssId="$cssId";var styleContent=".prompt{width:50%;position:fixed;left:25%;height:auto;background:#000;border-radius:5px;top:200px;text-align:center;color:#fff;padding:15px;box-shadow:1px 1px 5px rgba(0,0,0,.5);z-index:99999}@media(min-width:992px){.prompt{top:20px}}";var createStyleElement=function(){if(isExist(cssId)){return false}var style=document.createElement("style");style.type="text/css";style.id=cssId;style.innerHTML=styleContent;document.getElementsByTagName("HEAD").item(0).appendChild(style)};var createMsgElement=function(msg,isClose){if(isExist(id)){clearTimeOut()}remove();var div=document.createElement("div");div.id=id;div.className="prompt";div.innerHTML=msg;document.body.appendChild(div);if(!isClose){autoClose()}};var isExist=function(_id){return document.getElementById(_id)?true:false};var remove=function(){var node=document.getElementById(id);if(node)document.body.removeChild(node)};var clearTimeOut=function(){if(timer)window.clearTimeout(timer)};var autoClose=function(){timer=setTimeout(function(){clearTimeOut();remove()},3000)};createStyleElement();return{msg:function(msg,isClose){createMsgElement(msg,isClose)},remove:function(){if(isExist(id)){clearTimeOut()}remove()}}})();
function log(obj){
    if((typeof obj) == "object"){//错误的路径
        console.error(obj);
    }else{
        console.log(obj);
    }
};
function ajaxFailure(xhr){
    try{
        if(xhr && xhr.responseText){
            var _json = JSON.parse(xhr.responseText);
            if(!_json.res){
                message.msg(_json.msg);
            }else{
                message.msg(xhr.responseText);
            }
        }else{
            message.msg("后端错误.");
        }
    }catch(ex){
        if(xhr && xhr.responseText){
            message.msg(xhr.responseText);
        }else{
            message.msg("后端错误.");
        }
    }
};