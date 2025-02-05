// import {io} from "socket.io-client"

// export async function initSocket(){
//     const option={
//         'force new connection': true,
//         reconnectionAttempts : 1,
//         timeout: 10000,
//         transports: ['websocket'],
//     };
//     return io("wss://https://realtimecode-ypcz.onrender.com/",option)
// }
import { io } from "socket.io-client";

export async function initSocket() {
    const options = {
        forceNew: true,
        reconnectionAttempts: 3, // Try reconnecting 3 times
        timeout: 10000, // 10 seconds timeout
        transports: ["websocket"],
    };

    return io("wss://realtimecode-ypcz.onrender.com", { 
        transports: ["websocket"], 
        path: "/socket.io/" // Default Socket.io path
    });
    
}
