const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            console.log("This browser connected to socket")
            // Get the online user list
            // socket.emit("getUsers");

        });

        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);
            console.table(onlineUsers)
        })


        socket.on("broadcastNewConnection", () => {
            console.log("This broadcasts a new connection")
        })
    };

    const getOnlineUsers = () => {
        socket.emit("getUsers");
    }

    return { getSocket, connect };
})();