/**
 * 处理公共的请求的
 * Created by WG on 2015/12/26.
 */
var superagent      = require('superagent');
var cheerio         = require('cheerio');
var commonResponse  = require('../common/commonResponse');

/**
 * 根据网址获取 网站的 标题
 * @param req
 * @param res
 * @param next
 */
exports.getPageTitle  =   function(req, res, next){
    var url =   req.body.url;
    try{
        if(url){
            superagent.get(url)
                .end(function (err, _result) {
                    var $ = cheerio.load(_result.text);
                    var title = $('title')[0];
                    if(title){
                        var _res = title.children[0].data;
                        res.json(commonResponse.success(_res));
                    }
                    else{
                        res.json(commonResponse.success(url));
                    }
                });
        }else{
            res.json(commonResponse.success(url));
        }
    }catch(ex){
        res.json(commonResponse.success(url));
    }
};

/**
 *七牛上传文件的处理
 * @param req
 * @param res
 * @param next
 */
exports.upLoadFile  =   function(req,res,next){
    try{

    }catch(ex){
        next(ex);
    }
};