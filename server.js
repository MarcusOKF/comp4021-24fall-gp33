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


let onlineUsers = [
    {
        username: "tom",
        playerNo: 2,
        name: "Tom Chan",
        points: 0,
        isFrozen: false,
        hasFreezeAbility: false,
        isDoublePoints: false,
        cooldown: 0
    },
    {
        username: "sam",
        playerNo: 1,
        name: "Sam Wong",
        points: 0,
        isFrozen: false,
        hasFreezeAbility: false,
        isDoublePoints: false,
        cooldown: 0
    }
]

let marbles = {}

const freezeAbilityTime = 6
const doublePointsAbilityTime = 6


// Get all online users
app.get("/onlineUsers", (req, res)=>{
    res.json(onlineUsers)
})

// Socket related code
io.on("connection", (socket) => {
    // Add a new user to the online user list
    // To de done

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

});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started at port 8000...");
});