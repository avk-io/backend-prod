const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        return error(res,401,"No Token")
    }
    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        req.userId = decoded.userId
        next()
    }catch(err){
        error(res,403,"Invalid Token")
    }
}