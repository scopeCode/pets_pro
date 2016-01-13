/**
 * Created by scj-mo on 2015/12/6.
 */
var message=(function(){var timer=null;var id="$messageId";var cssId="$cssId";var styleContent=".prompt{width:50%;position:fixed;left:25%;height:auto;background:#000;border-radius:5px;top:200px;text-align:center;color:#fff;padding:15px;box-shadow:1px 1px 5px rgba(0,0,0,.5);z-index:99999}@media(min-width:992px){.prompt{top:20px}}";var createStyleElement=function(){if(isExist(cssId)){return false}var style=document.createElement("style");style.type="text/css";style.id=cssId;style.innerHTML=styleContent;document.getElementsByTagName("HEAD").item(0).appendChild(style)};var createMsgElement=function(msg,isClose){if(isExist(id)){clearTimeOut()}remove();var div=document.createElement("div");div.id=id;div.className="prompt";div.innerHTML=msg;document.body.appendChild(div);if(!isClose){autoClose()}};var isExist=function(_id){return document.getElementById(_id)?true:false};var remove=function(){var node=document.getElementById(id);if(node)document.body.removeChild(node)};var clearTimeOut=function(){if(timer)window.clearTimeout(timer)};var autoClose=function(){timer=setTimeout(function(){clearTimeOut();remove()},3000)};createStyleElement();return{msg:function(msg,isClose){createMsgElement(msg,isClose)},remove:function(){if(isExist(id)){clearTimeOut()}remove()}}})();
function formatDate(params) {
    var value = params,
        timestamp,
        month,
        date,
        year,
        hour,
        min,
        second;

    timestamp = new Date(value);
    month   =   timestamp.getMonth() + 1;
    month   =   ("0"+month).slice(-2);
    date    =   timestamp.getDate();
    date    =   ("0"+date).slice(-2);
    year    =   timestamp.getFullYear();
    hour    =   timestamp.getHours();
    hour    =   ("0"+hour).slice(-2);
    min     =   timestamp.getMinutes();
    min     =   ("0"+min).slice(-2);
    second  =   timestamp.getSeconds();
    second  =   ("0"+second).slice(-2);

    return (year + '/' + month + '/' + date +' ' + hour+':'+min+':'+second);
};
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
var  mobileRule     =   /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
var  isPcOpen       =   function(){
    var isOnPc= (/Android|webOS|Windows Phone|iph|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
    if(!isOnPc){
        return true;
    }
    return false;
};
/**
 * 格式化字符串
 * @param a  {JSON}     JSON设定格式化字符串中对应的值
 * @returns  {String}
 * DEMO:     var li = "<li class='#{cls}'>#{text}</li>"; console.log(li.format({cls:'cls',text:'test'}));
 */
String.prototype.format = function(a){
    c = String(this);
    var b = Array.prototype.slice.call(arguments, 0),
        d = Object.prototype.toString;
    if (b.length) {
        b = b.length == 1 ? (a !== null && (/\[object Array\]|\[object Object\]/.test(d.call(a))) ? a : b) : b;
        return c.replace(/#\{(.+?)\}/g, function (f, h) {
            var g = b[h];
            if ("[object Function]" == d.call(g)) {
                g = g(h);
            }
            return ("undefined" == typeof g ? "" : g);
        });
    }
    return c;
};