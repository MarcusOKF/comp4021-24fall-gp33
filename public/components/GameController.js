// Controll interactions of the game

const GameController = (function() {
    let canvas;
    let context;

    let userFrog1, userFrog2;
    let user1, user2;
    let pond, pondDimensions;
    let spectatorFrogs = [];
    let marbles = {}

    let pointsPanel;
    let abilityPanel;
    let timePanel;

    const totalGameTime = 60;
    let gameStartTime = 0;


    const startGame = () => {
        canvas = $("#game-arena-canvas")
        context = canvas.get(0).getContext("2d")

        // Load the game objects
        fetchData("/onlineUsers")
        .then(users => {
            user1 = users.find(u => u.playerNo == 1)
            user2 = users.find(u => u.playerNo == 2)
            if (user1 && user2){
                // Load the UserFrogs
                userFrog1 = UserFrog(context, canvas.get(0).width/2, 10, user1)
                userFrog1.loadFrog("n")
                userFrog2 = UserFrog(context, canvas.get(0).width/2, canvas.get(0).height-80, user2)
                userFrog2.loadFrog("n")

                // Load the pond, and relate the two frogs to the pond.
                pond = Pond(canvas, context, 75, 100, userFrog1, userFrog2)
                pond.draw("Ready?")        
                
                // Generate Marbels in the pond on the server side , to provide the same view for both players
                pondDimensions = pond.getPondParams()
                Socket.generateMarbles(pondDimensions) // This triggers the loadMarbles() function

                // //Load points panels
                pointsPanel = PointsPanel

                // // Load ability panels
                abilityPanel = AbilityPanel

                // Load time panel
                timePanel = TimePanel
                
            } else {
                console.log("Need two users.....")
                return
            }
        })

        // Start main game loop after X seconds, to make sure the stuff is loaded
        let countdownSeconds = 3

        function countdown(seconds) {
            var interval = setInterval(function() {
                timePanel.updateStartGameTimer(seconds)

                seconds--;
              
                if (seconds < 0) {
                    clearInterval(interval);
                    // Enbale pond clickable
                    pond.enableClickablePond()

                    // Init points panel
                    pointsPanel.refreshUserPointsPanel(user1)
                    pointsPanel.refreshUserPointsPanel(user2)

                    // Init ability panel
                    abilityPanel.refreshUserAbilityPanel(user1)
                    abilityPanel.refreshUserAbilityPanel(user2)

                    requestAnimationFrame(doFrame)
                }
            }, 1000);
        }
          
        countdown(countdownSeconds);        
    }

    const loadMarbles = (ms) => {
        for (let [marbleId, params] of Object.entries(ms)){
            const {x, y, color, points, size, speedX, speedY} = params
            marbles[marbleId] = Marble(context, x, y, color, points, size, speedX, speedY)
        }
    }

    const drawMarbles = () => {
        for (let [marbleId, marble] of Object.entries(marbles)){
            marble.draw()
        }
    }

    const updateMarbles = (ms) => {
        for (let [marbleId, params] of Object.entries(ms)){
            const {x, y} = params
            if (marbles[marbleId]){
                marbles[marbleId].updateMarblePosition(x, y) 
            }
             
        }
    }

    const deleteMarbles = (marbleIdxs) => {
        for (let idx of marbleIdxs){
            delete marbles[idx]
        }
    }


    const doFrame = (now) => {
        // Timer
        if (gameStartTime == 0) gameStartTime = now;
        const gameTimeSoFar = now - gameStartTime;
        const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
        timePanel.updateTimer(timeRemaining)

        // Times up, stop animation
        if (timeRemaining <= 0){
            gameOverHandler()
            return
        }

        // Clear the context
        context.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height);

        // Draw the objects
        userFrog1.draw()
        userFrog2.draw()
        pond.draw()

        // Randomly update the coordinates of marbles in server, then draw
        Socket.randomizeMarbles(pondDimensions) // This also called the updateMarbles function
        drawMarbles()


        // Looping
        requestAnimationFrame(doFrame)
    }

    const gameOverHandler = () => {
        timePanel.updateTimer("0")
        pond.disableClickablePond()
    }

    const drawTongueOnCanvas = (points) => {
        // From side: points[0] - points[1]
        // To side: points[2] - points[3]

        const animationFrames = 30; // Number of frames for the animation
        const deltaX = (points[2].x - points[0].x) / animationFrames; // Amount to increment x per frame
        const deltaY = (points[2].y - points[0].y) / animationFrames; // Amount to increment y per frame
        
        let currentFrame = 0;
        
        function animate() {
        
            // Draw parallelogram
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            context.lineTo(points[1].x + deltaX*currentFrame, points[1].y + deltaY*currentFrame);
            context.lineTo(points[0].x + deltaX*currentFrame, points[0].y + deltaY*currentFrame);
            context.closePath();
            context.fillStyle = "red";
            context.fill()
            context.lineWidth = 2;
            context.stroke()
        
            currentFrame++;
        
            if (currentFrame < animationFrames+1) {
                requestAnimationFrame(animate);
            } 
        }
        
        animate();
    }

    // Core logic for calculating whether a marble is eaten
    const handleShootTongueToTarget = (points, user) => {
        let addedPoints = 0;
        let marblesToRemove = []

        for (let [marbleId, marble] of Object.entries(marbles)){
            const {currX:circleX, currY:circleY, size:radius} = marble.getMarbleXYR()
            let eat = checkOverlap(circleX, circleY, radius, points[0], points[1], points[2], points[3])
            if (eat) {
                addedPoints += marble.getMarblePoints()
                marblesToRemove.push(marbleId)
            }
        }

        Socket.addUserPoints(user, addedPoints)
        Socket.deleteMarbles(marblesToRemove)

    }


    return { startGame, drawTongueOnCanvas, loadMarbles, updateMarbles, handleShootTongueToTarget, deleteMarbles }
})();