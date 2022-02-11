const jwt = require('jsonwebtoken');
const sendRes = require("./sendRes");
const authentitacion = {};

authentitacion.genToken = async (data, secret_key) => {
    return await jwt.sign(data, secret_key, { expiresIn: 60 * 60 * 24 });
};

authentitacion.verifyAdminToken = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization){
        return next(sendRes(res, 401, false, "UNAUTHORIZED. NO TOKEN PROVIDED"));
    };
    try{
        const token = authorization.split(' ')[1];
        const payload= jwt.verify(token,req.app.get('secret_key'));
        if(payload.rol!=="admin"){
            return next(sendRes(res, 403, false, "UNAUTHORIZED. DOES NOT MEET REQUIREMENTS"));
        };
    }catch(e){
        console.log(e.message);
        return next(sendRes(res, 401, false, "UNAUTHORIZED. INVALID TOKEN"));
    };
    return next();
};

authentitacion.verifyUserToken = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization){
        return next(sendRes(res, 401, false, "UNAUTHORIZED. NO TOKEN PROVIDED"));
    };
    try{
        const token = authorization.split(' ')[1];
        const payload= jwt.verify(token,req.app.get('secret_key'));
        if(payload.rol!=="user" && payload.rol!=="lider" && payload.rol!=="admin"){
            console.log(payload.rol)
            return next(sendRes(res, 403, false, "UNAUTHORIZED. DOES NOT MEET REQUIREMENTS"));
        };
    }catch(e){
        console.log(e.message);
        return next(sendRes(res, 401, false, "UNAUTHORIZED. INVALID TOKEN"));
    };
    return next();
};

authentitacion.verifyLeaderToken = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization){
        return next(sendRes(res, 401, false, "UNAUTHORIZED. NO TOKEN PROVIDED"));
    };
    try{
        const token = authorization.split(' ')[1];
        const payload= jwt.verify(token,req.app.get('secret_key'));
        if(payload.rol!=="admin" && payload.rol!=="lider"){
            return next(sendRes(res, 403, false, "UNAUTHORIZED. DOES NOT MEET REQUIREMENTS"));
        };
    }catch(e){
        console.log(e.message);
        return next(sendRes(res, 401, false, "UNAUTHORIZED. INVALID TOKEN"));
    };
    return next();
};

module.exports = authentitacion;