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
        });


        socket.on("broadcastNewConnection", () => {
            console.log("This broadcasts a new connection")
        })

        socket.on("startGameForAllUsers", () => {
            console.log("Start game for users")
            GameController.startGame()
        })

        socket.on("drawTongue", (points) => {
            GameController.drawTongueOnCanvas(JSON.parse(points))
        })
    };

    const startGame = () => {
        socket.emit("startGame")
    }

    const drawTongue = (points) => {
        socket.emit("passTonguePoints", JSON.stringify(points))
    }

    return { getSocket, connect, startGame, drawTongue };
})();