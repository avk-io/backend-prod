module.exports = (req,res,next)=>{
    const {email , password} = req.body

    if(!email||!email.endsWith("@gmail.com")||!password||password.length<6){
        return error(res,422,"Invalid Credentials")
    }
    next()
}