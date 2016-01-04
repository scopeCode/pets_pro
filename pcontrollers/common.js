/**
 * 处理公共的请求的
 * Created by WG on 2015/12/26.
 */
var superagent      =   require('superagent');
var cheerio         =   require('cheerio');
var qn              =   require('../pmiddlewares/qnIndex');
var formidable      =   require('formidable');
var commonResponse  =   require('../common/commonResponse');

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
            var form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            form.parse(req, function(err, fields, files) {
                var _path;
                for(var key in files){
                    _path = files[key].path;
                }
                if(_path==""){
                    res.json(commonResponse.fail('没有发现要上传的文件.'));
                }else{
                    qn.putWithoutKey(_path,null,function(ret){
                        res.json(commonResponse.success({key:ret.key,hash:ret.hash}));
                    },function(err){
                        res.json(commonResponse.fail(err.message));
                    });
                }
            });
        }catch(ex){
            next(ex);
        }
};