import {io} from "socket.io-client"

export async function initSocket(){
    const option={
        'force new connection': true,
        reconnectionAttempts : 1,
        timeout: 10000,
        transports: ['websocket'],
    };
    return io("localhost:3000",option)
}