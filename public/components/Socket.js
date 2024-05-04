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

        socket.on("loadMarbles", (marbles) => {
            GameController.loadMarbles(JSON.parse(marbles))
        })

        socket.on("updateMarbles", (marbles) => {
            GameController.updateMarbles(JSON.parse(marbles))
        })

        socket.on("deleteMarbles", (marbleIdxs) => {
            GameController.deleteMarbles(JSON.parse(marbleIdxs))
        })

        socket.on("refreshUserPointsPanel", (user) => {
            PointsPanel.refreshUserPointsPanel(JSON.parse(user))
        })

        socket.on("refreshUserAbilityPanel", (user) => {
            AbilityPanel.refreshUserAbilityPanel(JSON.parse(user))
        })

        socket.on("freezePlayer", (user) => {
            GameController.freezeUserFrog(JSON.parse(user))
        })

        socket.on("unFreezePlayer", (user) => {
            GameController.unFreezeUserFrog(JSON.parse(user))
        })

        socket.on("toggleDoublePointsFrogImage", (user, isDoublePoints) => {
            GameController.toggleDoublePointsFrogImage(JSON.parse(user), isDoublePoints)
        })

    };

    const startGame = () => {
        socket.emit("startGame")
    }

    const drawTongue = (points) => {
        socket.emit("passTonguePoints", JSON.stringify(points))
    }

    const generateMarbles = (dim) => {
        socket.emit("generateMarbles", JSON.stringify(dim))
    }

    const randomizeMarbles = (dim) => {
        socket.emit("randomizeMarbles", JSON.stringify(dim))
    }

    const deleteMarbles = (marbleIdxs) => {
        socket.emit("deleteMarbles", JSON.stringify(marbleIdxs))
    }

    const addUserPoints = (user, addedPoints) => {
        socket.emit("addUserPoints", JSON.stringify(user), addedPoints)
    }

    const updateCooldown = (user, cooldown) => {
        socket.emit("updateCooldown", JSON.stringify(user), cooldown)
    }

    const setUserFreezeAbility = (user, state) => {
        socket.emit("setUserFreezeAbility", JSON.stringify(user), state)
    }

    const useFreezeAbilityOnOpponent = (initiator) => {
        socket.emit("useFreezeAbilityOnOpponent", JSON.stringify(initiator))
    }

    const useDoublePointsAbility = (user) => {
        socket.emit("useDoublePointsAbility", JSON.stringify(user))
    }

    return { getSocket, connect, startGame, drawTongue, generateMarbles, randomizeMarbles, addUserPoints , deleteMarbles, updateCooldown, setUserFreezeAbility, useFreezeAbilityOnOpponent, useDoublePointsAbility};
})();