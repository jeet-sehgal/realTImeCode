const express=require("express");
const app=express();
const {Server} = require("socket.io");
const http=require("http");
const cors = require('cors');
const axios=require("axios");
const  path= require("path");

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        method:['GET',"POST"],
        allowedHeaders: ['Content-Type','Access-Control-Allow-Origin', 'Authorization'] 
    }
})


const userMap={};
function all(id){
    i=0;
    const clients=Array.from(io.sockets.adapter.rooms.get(id)||[]).map(ele=>{
        admin=i==0?true:false;
        i++;
       return {id:ele,
        name:userMap[ele],
        admin,
        

    }
    })
    return clients
}
app.use(express.json());
app.use(express.static('dist'))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", 'index.html'));
});
app.post("/exe",async (req,res)=>{
    // console.log("call")
    // console.log(req.body)
    try {
        const response = await axios.post("https://api.jdoodle.com/v1/execute", req.body, {
          headers: { "Content-Type": "application/json" },
        });
        res.json(response.data);
        // console.log("api")
      } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Internal server error" });
      }
})
io.on("connection",(socket)=>{
    // console.log("user ",socket.id)
    
    socket.on("join",({name,id})=>{
        userMap[socket.id]=name;
        
        socket.join(id);
        const otherUser=Array.from(io.sockets.adapter.rooms.get(id)||[])
        const clients=all(id)
        // client=clients.map(ele=>{
        //     if(ele.id==socket.id){
        //         Object.assign(ele, { you: true })
        //     }
        //     else{
        //         if(you in ele){
                   
        //         }
        //         else{

        //         }
        //         Object.assign(ele, { you: false })
        //     }
        // })
        otherUser.forEach(ele=>{
                // console.log(clients)
            
                io.to(ele).emit("joined",{name,socket:socket.id,clients})
            
        })
        socket.emit("you",{id:socket.id,admin:clients[0].id,adminName:userMap[clients[0].id]})
        
        
    })

    socket.on("kick",(id)=>{
        if (userMap[id]) {
            // console.log("Kicking user:", userMap[id]);
            io.to(id).emit("kickedOut",id );
        } else {
            // console.log("User  not found:", id);
        }
    })

    socket.on("code-change",({code,roomID})=>{
        // console.log(roomID);
        if(code!=null){
        socket.in(roomID).emit("code-change",{code})}
    })
    socket.on("code-sync",({code,id})=>{
        if(code!=null){

            io.to(id).emit("code-change",{code});
            // console.log(code);
        }
    })
    
    

    socket.on("disconnecting",()=>{
        const username=userMap[socket.id]
        const rooms = [...socket.rooms];
        
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("leave", {
                id: socket.id,
                username,
              
            });
        });
        
        socket.leave()
        delete userMap[socket.id]
    })
})

server.listen(3000,async ()=>{
    // console.log("server is started");
    
    
})
