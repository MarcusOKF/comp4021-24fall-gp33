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
			socket.emit('get users')
            // Get the player selection status
			socket.emit('get player1&2 status')

            OnlineUsersPanel.showPanel()
            PlayerSelectionPanel.show()
        });

        socket.on('update player1&2 status', (status) => {
			status = JSON.parse(status)

            PlayerSelectionPanel.updatePlayerStatus(status)
        })

        // Show player 1 & 2 status
		socket.on('player1&2 status', (playersInfo) => {
			playersInfo = JSON.parse(playersInfo)

            PlayerSelectionPanel.updatePlayerStatus(playersInfo)
		})

        // Set up the users event
		socket.on('users', (onlineUsers) => {
			onlineUsers = JSON.parse(onlineUsers)

			// Show the online users
			OnlineUsersPanel.update(onlineUsers)
		})

        // Set up the add user event
		socket.on('add user', (user) => {
			user = JSON.parse(user)

			// Add the online user
			OnlineUsersPanel.addUser(user)
		})

        // Set up the remove user event
		socket.on('remove user', (user) => {
			user = JSON.parse(user)

			// Remove the online user
			OnlineUsersPanel.removeUser(user)
		})

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

        socket.on("hasAnyUserWon", (hasAnyUserWon) => {
            GameController.setHasAnyUserWon(hasAnyUserWon)
        })

        socket.on("resetGameSettings",() => {
            GameController.resetGameSettings()
        })

    };

    const joinPlayer = function (number) {
        socket.emit('join player', number)
    }

    // This function disconnects the socket from the server
	const disconnect = function () {
		socket.disconnect()
		socket = null
        OnlineUsersPanel.hidePanel()
        PlayerSelectionPanel.hide()
	}

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

    const checkIfAnyUserHasWon = () => {
        socket.emit("checkIfAnyUserHasWon")
    }

    const resetGameSettings = () => {
        socket.emit("resetGameSettings")
    }

    return { getSocket, connect, disconnect, joinPlayer, startGame, drawTongue, generateMarbles, randomizeMarbles, addUserPoints , deleteMarbles, updateCooldown, setUserFreezeAbility, useFreezeAbilityOnOpponent, useDoublePointsAbility, checkIfAnyUserHasWon, resetGameSettings};
})();