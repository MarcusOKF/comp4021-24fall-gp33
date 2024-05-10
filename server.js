const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

const { createServer } = require("http")
const { Server } = require("socket.io");
const { on } = require("events");

// Create the Express app
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer)

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const gameSession = session({
	secret: 'hungryFrog',
	resave: false,
	saveUninitialized: false,
	rolling: true,
	cookie: { maxAge: 300000 },
})
app.use(gameSession)

// helper function for getting username & name in the onlineUsers array
function getInfoWithNumber(playerNumber) {
    let username = null
    let name = '???'

    for (const player of onlineUsers) {
        if (player.playerNo == playerNumber) {
            username = player.username
            name = player.name
        }
    }

    return { username, name }
}

// let onlineUsers = [
//     {
//         username: "tom",
//         playerNo: 2,
//         name: "Tom Chan",
//         points: 0,
//         isFrozen: false,
//         hasFreezeAbility: false,
//         isDoublePoints: false,
//         cooldown: 0
//     },
//     {
//         username: "sam",
//         playerNo: 1,
//         name: "Sam Wong",
//         points: 0,
//         isFrozen: false,
//         hasFreezeAbility: false,
//         isDoublePoints: false,
//         cooldown: 0
//     }
// ]
let onlineUsers = []

let marbles = {}

const freezeAbilityTime = 6
const doublePointsAbilityTime = 6
const pointsToWin = 250;


// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
	return /^\w+$/.test(text)
}

// Handle the /register endpoint
app.post('/register', (req, res) => {
	// Get the JSON data from the body
	const { username, name, password } = req.body
    
	const users = JSON.parse(fs.readFileSync('./data/users.json'))
    
	if (!username || !name || !password) {
		res.json({
			status: 'error',
			error: 'Username / name / password cannot be empty.',
		})
		return
	}
	if (!containWordCharsOnly(username)) {
		res.json({
			status: 'error',
			error: 'Username should contain only underscores, letters or numbers.',
		})
		return
	}
	if (username in users) {
		res.json({
			status: 'error',
			error: 'Username already taken.',
		})
		return
	}
    
	const hash = bcrypt.hashSync(password, 10)
	users[username] = { name, password: hash }
    
	fs.writeFileSync('./data/users.json', JSON.stringify(users, null, ' '))

	res.json({ status: 'success' })
})

// Handle the /signin endpoint
app.post('/signin', (req, res) => {
	// Get the JSON data from the body
	const { username, password } = req.body
    
	const users = JSON.parse(fs.readFileSync('./data/users.json'))
    
	if (username in users == false) {
		res.json({
			status: 'error',
			error: 'Incorrect username / password.',
		})
		return
	}
	const user = users[username]
	if (!bcrypt.compareSync(password, user.password)) {
		res.json({
			status: 'error',
			error: 'Incorrect username / password.',
		})
		return
	}
    
	req.session.user = { username, name: user.name }
	res.json({
		status: 'success',
		user: { username, name: user.name },
	})
})

// Handle the /validate endpoint
app.get('/validate', (req, res) => {
	if (!req.session.user) {
		res.json({
			status: 'error',
			error: 'Session not found.',
		})
		return
	}
    
	res.json({
		status: 'success',
		user: req.session.user,
	})
})

// Handle the /signout endpoint
app.get('/signout', (req, res) => {
	delete req.session.user

	res.json({
		status: 'success',
	})
})

// Check player ID
app.get('/playerID', (req, res) => {
    const player1Status = getInfoWithNumber(1)
    const player2Status = getInfoWithNumber(2)
    const currentUser = req.session.user

    if (currentUser.username == player1Status.username) {
        console.log('get player ID: 1')
        res.json({ id: 1 })
        return
    }
    if (currentUser.username == player2Status.username) {
        console.log('get player ID: 2')
        res.json({ id: 2 })
        return
    }

    console.log('get player ID: -1 !!!ERROR!!!')
    res.json({ id: -1 })
})

// Get all online users
app.get("/onlineUsers", (req, res)=>{
    // console.log('server: getting all online users...')
    res.json(onlineUsers)
})

// Handle online user list in the waiting room
const waitingUsers = {}

// Tell the Socket.IO server to use the session object for each socket
io.use((socket, next) => {
	gameSession(socket.request, {}, next)
})

// Socket related code
io.on("connection", (socket) => {
    // Add a new user to the online user list
	if (socket.request.session.user) {
		const user = socket.request.session.user
		const { username } = user
		waitingUsers[username] = user
		io.emit('add user', JSON.stringify(user))
        // console.log('player status: ', onlineUsers)
	}

    // User sign out
	socket.on('disconnect', () => {
		// Remove the user from the online user list
		if (socket.request.session.user) {
			const user = socket.request.session.user
			const { username } = user
			if (waitingUsers[username]) {
				delete waitingUsers[username]
			}
			io.emit('remove user', JSON.stringify(user))

            for (const player of onlineUsers) {
                if (player.username == username) {
                    const index = onlineUsers.indexOf(player);
                    if (index > -1) {
                        onlineUsers.splice(index, 1);
                      }
                }
            }
            io.emit("update player1&2 status", JSON.stringify({ player1: getInfoWithNumber(1), player2: getInfoWithNumber(2) }))
		}
	})

    // Client side request online user list
	socket.on('get users', () => {
		// Send the online users to the browser
		socket.emit('users', JSON.stringify(waitingUsers))
	})

    socket.on("join player", (number) => {
        if (socket.request.session.user) {
            const player1Status = getInfoWithNumber(1)
            const player2Status = getInfoWithNumber(2)
            const user = socket.request.session.user
            if (number == 1) {
                if (player1Status.username == null && player2Status.username !== user.username) {
                    onlineUsers.push(
                        {
                            username: user.username,
                            playerNo: 1,
                            name: user.name,
                            points: 0,
                            isFrozen: false,
                            hasFreezeAbility: false,
                            isDoublePoints: false,
                            cooldown: 0
                        }
                    )
                    socket.emit('update session player ID', JSON.stringify({ playerID: 1 }))
                    io.emit("update player1&2 status", JSON.stringify({ player1: getInfoWithNumber(1), player2: getInfoWithNumber(2) }))
                }
            } else if (number == 2) {
                if (player2Status.username == null && player1Status.username !== user.username) {
                    onlineUsers.push(
                        {
                            username: user.username,
                            playerNo: 2,
                            name: user.name,
                            points: 0,
                            isFrozen: false,
                            hasFreezeAbility: false,
                            isDoublePoints: false,
                            cooldown: 0
                        }
                    )
                    socket.emit('update session player ID', JSON.stringify({ playerID: 2 }))
                    io.emit("update player1&2 status", JSON.stringify({ player1: getInfoWithNumber(1), player2: getInfoWithNumber(2) }))
                }
            }

            // check is there enough player, if yes, start the game
            if (onlineUsers.length == 2) {
                io.emit("startGameForAllUsers")  
            }
        }
    })

    socket.on("join player rematch", (number) => {
        if (socket.request.session.user) {
            const player1Status = getInfoWithNumber(1)
            const player2Status = getInfoWithNumber(2)
            const user = socket.request.session.user
            
                if (player1Status.username == null && player2Status.username !== user.username) {
                    onlineUsers.push(
                        {
                            username: user.username,
                            playerNo: 1,
                            name: user.name,
                            points: 0,
                            isFrozen: false,
                            hasFreezeAbility: false,
                            isDoublePoints: false,
                            cooldown: 0
                        }
                    )
                    socket.emit('update session player ID', JSON.stringify({ playerID: 1 }))
                    io.emit("update player1&2 status", JSON.stringify({ player1: getInfoWithNumber(1), player2: getInfoWithNumber(2) }))
                }
                
             
                else if (player2Status.username == null && player1Status.username !== user.username) {
                    onlineUsers.push(
                        {
                            username: user.username,
                            playerNo: 2,
                            name: user.name,
                            points: 0,
                            isFrozen: false,
                            hasFreezeAbility: false,
                            isDoublePoints: false,
                            cooldown: 0
                        }
                    )
                    socket.emit('update session player ID', JSON.stringify({ playerID: 2 }))
                    io.emit("update player1&2 status", JSON.stringify({ player1: getInfoWithNumber(1), player2: getInfoWithNumber(2) }))
                }
            

            // check is there enough player, if yes, start the game
            if (onlineUsers.length == 2) {
                io.emit("startGameForAllUsers")  
            }
        }
    })

    // Client side request player 1 & 2 status
    socket.on('get player1&2 status', () => {
        const player1 = getInfoWithNumber(1)
        const player2 = getInfoWithNumber(2)
        io.emit('player1&2 status', JSON.stringify({ player1, player2 }))
    })

    // Broadcast to all users 
    io.emit("broadcastNewConnection")


    socket.on("startGame", () => {
        io.emit("startGameForAllUsers")  
    })

    socket.on("passTonguePoints", (points) => {
        io.emit("drawTongue", points)
    })

    socket.on("generateMarbles", (dim) => {
        // Clear prev marbles
        marbles = {}

        // Dimenions of the pond
        dim = JSON.parse(dim)
        const {x, y, width, height} = dim

        // Can fine tune
        const getPointsByColor = (color) => {
            if (color == "yellow") return 2
            if (color == "green") return 4
            if (color == "black") return 7
            if (color == "blue") return 0
            return 0
        }

        // Can fine tune
        const getSizeByColor = (color) => {
            if (color == "yellow") return 12
            if (color == "green") return 9
            if (color == "black") return 7
            if (color == "blue") return 4
            return 0
        }

        // Can fine tune
        const getSpeedByColor = (color) => {
            // For randomizing direction
            const randomDirection = () => {
                return Math.random() < 0.5 ? -1 : 1
            }
            if (color == "yellow") return 0.2 * randomDirection()
            if (color == "green") return 0.5 * randomDirection()
            if (color == "black") return 0.8 * randomDirection()
            if (color == "blue") return 1.1 * randomDirection() 
            return 0
        }

        // Generate coordinates
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
          
        // Assign portion
        const totalMarbles = 100
        const yellowTotal = Math.floor(0.5 * totalMarbles)
        const greenTotal = Math.floor(0.3 * totalMarbles)
        const blackTotal = Math.floor(0.15 * totalMarbles)
        const blueTotal = Math.floor(0.05 * totalMarbles)
        

        // Genreate marble objects
        const marbleColors = Array(yellowTotal).fill("yellow")
        .concat(Array(greenTotal).fill("green"))
        .concat(Array(blackTotal).fill("black"))
        .concat(Array(blueTotal).fill("blue"))


        for (let i = 0; i < marbleColors.length; i++){
            let c = marbleColors[i]
            marbles[`m${i}`] = {
                color: c,
                points: getPointsByColor(c),
                size: getSizeByColor(c),
                speedX: getSpeedByColor(c),
                speedY: getSpeedByColor(c),
                x: getRandomNumber(x, x+width),
                y: getRandomNumber(y, y+height)
            }
        }

        io.emit("loadMarbles", JSON.stringify(marbles))
    })

    socket.on("randomizeMarbles", (dim) => {
        // Dimenions of the pond
        dim = JSON.parse(dim)
        const {x, y, width, height} = dim

        // For randomizing direction
        const randomDirection = () => {
            return Math.random() < 0.5 ? -1 : 1
        }

        // Update marble position
        for (let [marbleId, marble] of Object.entries(marbles)){
            // Handle x direction
            let newPosX = marble.x + marble.speedX
            if (newPosX <= x) {
                newPosX = x
                marble.speedX *= -1
            } else if (newPosX >= x+width) {
                newPosX = x+width
                marble.speedX *= -1           
            }
            marble.x = newPosX

            // Handle y direction
            let newPosY = marble.y + marble.speedY
            if (newPosY <= y) {
                newPosY = y
                marble.speedY *= -1
            } else if (newPosY >= y+height) {
                newPosY = y+height
                marble.speedY *= -1           
            }
            marble.y = newPosY

        }

        io.emit("updateMarbles", JSON.stringify(marbles))
    })

    socket.on("addUserPoints", (user, addedPoints) => {
        user = JSON.parse(user)
        onlineUsers.forEach(u => {
            if (u.playerNo == user.playerNo) u.points += addedPoints * (u.isDoublePoints ? 2 : 1)
        })
        let returnUser = onlineUsers.find(u => u.playerNo == user.playerNo)
        io.emit("refreshUserPointsPanel", JSON.stringify(returnUser))
    })

    socket.on("deleteMarbles", (marbleIdxs) => {
        marbleIdxs = JSON.parse(marbleIdxs)

        for (let idx of marbleIdxs){
            delete marbles[idx]
        }

        io.emit("deleteMarbles", JSON.stringify(marbleIdxs))
    })

    socket.on("updateCooldown", (user, cooldown) => {
        user = JSON.parse(user)
        onlineUsers.forEach(u => {
            if (u.playerNo == user.playerNo) u.cooldown = cooldown
        })
        let returnUser = onlineUsers.find(u => u.playerNo == user.playerNo)
        io.emit("refreshUserAbilityPanel", JSON.stringify(returnUser))
    })

    socket.on("setUserFreezeAbility", (user, status) => {
        user = JSON.parse(user)
        onlineUsers.forEach(u => {
            if (u.playerNo == user.playerNo) u.hasFreezeAbility = status // bool
        })
        let returnUser = onlineUsers.find(u => u.playerNo == user.playerNo)

        io.emit("refreshUserAbilityPanel", JSON.stringify(returnUser))
    })

    socket.on("useFreezeAbilityOnOpponent", (user) => {
        user = JSON.parse(user)

        // If the user has no ability, then do nothing
        if (!onlineUsers.find(u => u.playerNo == user.playerNo).hasFreezeAbility) return

        // Update user statuses
        onlineUsers.forEach(u => {
            if (u.playerNo == user.playerNo) {
                // Set the initiator status to false
                u.hasFreezeAbility = false
            } else {
                // Set opponent to Frozen
                u.isFrozen = true
                io.emit("freezePlayer", JSON.stringify(u))

                // Unfreeze after some time
                setTimeout(() => {
                    u.isFrozen = false
                    io.emit("unFreezePlayer", JSON.stringify(u))
                    io.emit("refreshUserAbilityPanel", JSON.stringify(u))
                }, freezeAbilityTime*1000)
            }

            io.emit("refreshUserAbilityPanel", JSON.stringify(u))
        })

    })

    socket.on("useDoublePointsAbility", (user) => {
        user = JSON.parse(user)

        onlineUsers.forEach(u => {
            if (u.playerNo == user.playerNo) {
                // Do nothing if frozen
                if (u.isFrozen) return

                if (u.isDoublePoints == false){
                    u.isDoublePoints = true
                    io.emit("toggleDoublePointsFrogImage", JSON.stringify(u), true)

                    setTimeout(() => {
                        u.isDoublePoints = false
                        io.emit("refreshUserAbilityPanel", JSON.stringify(u))

                        if (!u.isFrozen){
                            io.emit("toggleDoublePointsFrogImage", JSON.stringify(u), false)
                        }
                    }, doublePointsAbilityTime * 1000)
                }
            }
        })
        let returnUser = onlineUsers.find(u => u.playerNo == user.playerNo)

        io.emit("refreshUserAbilityPanel", JSON.stringify(returnUser))
    })

    socket.on("checkIfAnyUserHasWon", () => {
        let hasAnyUserWon = false;

        onlineUsers.forEach(u => {
            if (u.points >= pointsToWin) hasAnyUserWon = true
        })

        io.emit("hasAnyUserWon", hasAnyUserWon)
    })    

    socket.on("resetGameSettings", () => {
        // onlineUsers.forEach(u => {
        //     u.points = 0
        //     u.isFrozen = false
        //     u.hasFreezeAbility = false
        //     u.isDoublePoints = false
        //     u.cooldown = 0
        // })
        // 
        io.emit("update player1&2 status", JSON.stringify({ player1: getInfoWithNumber(1), player2: getInfoWithNumber(2) }))

        io.emit("resetGameSettings")
    })  




    socket.on("getdataone", (time) => {
        let output = '';

        fs.readFile('./data/leaderboard.json', 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading leaderboard.json:', err);
              return;
            }
        
            let leaderboard = JSON.parse(data);
            let betterPlayerName;
        
            // Get the better score of both players
            if (onlineUsers.find((user) => user.playerNo === 1).points > onlineUsers.find((user) => user.playerNo === 2).points){
                betterPlayerName = onlineUsers.find((user) => user.playerNo === 1).name;
            }
            else {
                betterPlayerName = onlineUsers.find((user) => user.playerNo === 2).name;
            }
        
            // Get the name of the better player
            
            
            // Get the time of the better player
            const betterPlayerTime = time;
        
            // Find the maximum numeric key in the leaderboard
const maxPosition = Math.max(...Object.keys(leaderboard).map(Number));

// Calculate the next position
const nextPosition = maxPosition + 1;

// Add the better player to the leaderboard at the next position
                leaderboard[nextPosition] = {
                name: betterPlayerName,
                time: betterPlayerTime
                };
        
            // Sort the leaderboard by time (ascending order)
            const sortedLeaderboard = Object.keys(leaderboard)
                .sort((a, b) => parseInt(leaderboard[a].time) - parseInt(leaderboard[b].time))
                .reduce((acc, key, index) => {
                    acc[index + 1] = leaderboard[key];
                    return acc;
                }, {});

                // Keep only the top 5 entries in the leaderboard
                const top5Leaderboard = Object.keys(sortedLeaderboard)
                .slice(0, 5)
                .reduce((acc, key) => {
                    acc[key] = sortedLeaderboard[key];
                    return acc;
                }, {});

                
                Object.keys(top5Leaderboard).forEach((key) => {
                const position = key;
                const { name, time } = top5Leaderboard[key];
                output += `${name} ${time} `;
                });

                // Write the updated leaderboard back to the file
                fs.writeFile('./data/leaderboard.json', JSON.stringify(top5Leaderboard), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing leaderboard.json:', err);
                        return;
                    }
                    
                    console.log('Leaderboard updated successfully.');
                    });
                
          });

          
          

// Generate the output string







        io.emit("getdatatwo",{
            score1: onlineUsers.find((user) => user.playerNo === 1).points,
            score2: onlineUsers.find((user) => user.playerNo === 2).points,
            score1PerTime: onlineUsers.find((user) => user.playerNo === 1).points / time,
            score2PerTime: onlineUsers.find((user) => user.playerNo === 2).points / time,
            leaderboardOutput: output.trim()});
    })
    onlineUsers = []

});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started at port 8000...");
});