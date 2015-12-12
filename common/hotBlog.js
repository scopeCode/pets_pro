/**
 * Created by WG on 2015/12/10.
 */

var dustjs        =     require('adaro');

function getHotBlogReq(url,cb){

};

dustjs.dust.helpers.formatDate = function (chunk, context, bodies, params) {
    var value = dust.helpers.tap(params.value, chunk, context),
        timestamp,
        month,
        date,
        year;

    timestamp = new Date(value);
    month = timestamp.getMonth() + 1;
    date = timestamp.getDate();
    year = timestamp.getFullYear();

    return chunk.write(date + '.' + month + '.' + year);
};

/*
dustjs.dust.helpers.getHotBlog = function(chunk, context, bodies, params) {

    var api = params.petReq;

    if(api){
        return chunk.map(function(chunk){

            getHotBlogReq(api,function(err,result){

                if(err&&bodies['else']){
                    chunk.render(bodies['else'],context.push({error:err}));
                }else if(bodies.block){
                    chunk.render(bodies.block,context.push(result));
                }

                chunk.end();
            });
        })
    }else{
        return chunk.render(bodies.block,context);
    }
};*/