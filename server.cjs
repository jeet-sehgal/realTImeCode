const express=require("express");
const app=express();
const {Server} = require("socket.io");
const http=require("http");
const cors = require('cors');
const axios=require("axios");
const  path= require("path");
const { use } = require("react");

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
function allEdit(id){
    
    const clients=Array.from(io.sockets.adapter.rooms.get(id)||[]).map(ele=>{
        
        
       return {id:ele,
        edit:userEdit[ele]
    }
    })
    return clients
}
app.use(cors())
app.use(express.json());
app.use(express.static('dist'))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", 'index.html'));
});
app.post("/exe",async (req,res)=>{
    
    try {
        const response = await axios.post("https://api.jdoodle.com/v1/execute", req.body, {
          headers: { "Content-Type": "application/json" },
        });
        res.json(response.data);
       
      } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Internal server error" });
      }
})
const userEdit={}
io.on("connection",(socket)=>{
    console.log("user ",socket.id)
    
    socket.on("join",({name,id})=>{
        userMap[socket.id]=name;
        const roomExists = io.sockets.adapter.rooms.get(id)?.size > 0;
        if (roomExists){
            userEdit[socket.id]=false;
        }
        else{
            userEdit[socket.id]=true;
        }
        
        socket.join(id);
        const otherUser=Array.from(io.sockets.adapter.rooms.get(id)||[])
        const clients=all(id)
       
       const clientEdit=allEdit(id)
   
        otherUser.forEach(ele=>{
               
                io.to(ele).emit("joined",{name,socket:socket.id,clients,clientEdit})
            
        })
        socket.emit("you",{id:socket.id,admin:clients[0].id,adminName:userMap[clients[0].id]})
        
        
    })

    socket.on("kick",(id)=>{
        if (userMap[id]) {
           
            io.to(id).emit("kickedOut",id );
        } else {
            
        }
    })

    socket.on("edit",({id,editId})=>{
        userEdit[id]=!userEdit[id]
        client=allEdit(editId)
        client.forEach(ele=>{
            io.to(ele.id).emit("changeEdit",{client})
        })
        // socket.in(editId).emit("changeEdit",{client})
    })

    socket.on("code-change",({code,roomID})=>{
       
        if(code!=null){
        socket.in(roomID).emit("code-change",{code})}
    })
    socket.on("code-sync",({code,id})=>{
        if(code!=null){

            io.to(id).emit("code-change",{code});
           
        }
    })
    
    socket.on("adminChala",({editId,name,id})=>{
            userEdit[id]=true
            const clientEdit=allEdit(editId)
            console.log(clientEdit)
            socket.in(editId).emit("adminChange",{name,clientEdit} );
        
    })

    socket.on("disconnecting",()=>{
        const username=userMap[socket.id]
        const rooms = [...socket.rooms];
        
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("leave", {
                id: socket.id,
                username
              
            });
        });
        
        socket.leave()
        delete userMap[socket.id]
    })
})
const PORT = process.env.PORT || 3000;
server.listen(PORT,async ()=>{
    console.log("server is started");
    
    
})
