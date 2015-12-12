/**
 * Created by WG on 2015/12/10.
 */

var dustjs        =     require('adaro');

function getHotBlogReq(url,cb){

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