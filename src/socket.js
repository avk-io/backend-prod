const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")

module.exports= (server)=>{
    const io = new Server(server,{
        cors:{
            origin:"httP://localhost:5173",
            credentials:true
        }
    });

    io.use((socket,next)=>{
        const token = socket.handshake.auth.token;
        if(!token){
            return next(new Error("No token"))
        }
        try{
            const decode = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            )
            socket.userId = decoded.userId
            next();
        }catch{
            next(new Error("Invalid Token"))
        }
    });
    io.on("Connection",(socket)=>{
        console.log("Connected:",socket.userId)

        socket.on("disconnect",()=>{
            console.log("Disconnected:",socket.userId)
        });
    });
};