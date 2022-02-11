const sendRes = (res,code,success,message,token) =>{
    return res.status(code).json({success,message,token});
};

module.exports=sendRes;