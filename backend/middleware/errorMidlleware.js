const errrHandler=(err,req,resp,next)=>{
    const statusCode=resp.statusCode ? resp.statusCode : 500
    resp.status(statusCode)

    resp.json({
        message:err.message,
        stack:process.env.NODE_ENV==='production' ? null : err.stack
    })
}

module.exports={
    errrHandler,
}