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

    let hasAnyUserWon = false;

    /* Create the sounds */
    const sounds = {
        background: new Audio("../assets/forest.mp3"),
        shoot: new Audio("../assets/shoot.mp3"),
        gameover: new Audio("../assets/gameover.mp3")
    };

    const resetGameSettings = () => {
        context.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height); 

        userFrog1 = userFrog2 = null
        user1 = user2 = null
        pond = pondDimensions = null
        spectatorFrogs = []
        marbles = {}
        AudiencePack.removeAllAudiences();
        
        
        if (pointsPanel) pointsPanel.emptyPanels()
        if (abilityPanel) abilityPanel.emptyPanels()
        if (timePanel) timePanel.emptyPanel()

        gameStartTime = 0

        hasAnyUserWon = false
    }


    const startGame = () => {
     

        canvas = $("#game-arena-canvas")
        context = canvas.get(0).getContext("2d")
        context.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height);

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

                // load audience
                AudiencePack.initializeAudiences(context);
                
            } else {
                console.log("Need two users.....")
                return
            }
        })

        // Build keydown handlers
        /* Handle the keydown of using freeze ability */
        $(document).on("keydown", function(event) {

            /* Handle the key down */
            let keyCode = event.keyCode || event.which

            // Fake current user
            const user = { playerNo: Authentication.getPlayerID() } // Auth.getUser()

            // Check if a frog is frozen
            if (user.playerNo == 1) {
                if (userFrog1.userFrogTongue.frogIsFrozen()) return
            } else if (user.playerNo == 2) {
                if (userFrog2.userFrogTongue.frogIsFrozen()) return
            }
            
            // Press "F" to activate freeze ability
            if (keyCode == 70){
                console.log("Freeze")
                Socket.useFreezeAbilityOnOpponent(user)
            } 

            // Press "D" to activate double points ability
            if (keyCode == 68){
                console.log("Double points")
                Socket.useDoublePointsAbility(user)
            } 
        });

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

                    // Play background music
                    sounds.background.play()

                    // Start animation loop
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

    const freezeUserFrog = (user) => {
        if (user.playerNo == 1) {
            console.log("Froze frog 1")
            userFrog1.userFrogTongue.freezeTongue()
            userFrog1.loadFrog("s")
        } else if (user.playerNo == 2) {
            console.log("Froze frog 2")
            userFrog2.userFrogTongue.freezeTongue()
            userFrog2.loadFrog("s")
        }
    }

    const unFreezeUserFrog = (user) => {
        if (user.playerNo == 1) {
            console.log("Unfroze frog 1")
            userFrog1.userFrogTongue.unFreezeTongue()
            userFrog1.loadFrog("n")
        } else if (user.playerNo == 2) {
            console.log("Unfroze frog 2")
            userFrog2.userFrogTongue.unFreezeTongue()
            userFrog2.loadFrog("n")
        }
    }

    const toggleDoublePointsFrogImage = (user, isDoublePoints) => {
        if (user.playerNo == 1) {
            if (isDoublePoints) userFrog1.loadFrog("a")
            else userFrog1.loadFrog("n")
        } else if (user.playerNo == 2) {
            if (isDoublePoints) userFrog2.loadFrog("a")
            else userFrog2.loadFrog("n")
        }
    }

    const setHasAnyUserWon = (status) => { hasAnyUserWon = status }


    const doFrame = (now) => {
        // Timer
        if (gameStartTime == 0) gameStartTime = now;
        const gameTimeSoFar = now - gameStartTime;
        const timeRemaining = ((totalGameTime * 1000 - gameTimeSoFar) / 1000);
        timePanel.updateTimer(timeRemaining)

        // Clear the context
        context.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height);

        // Draw the objects
        userFrog1.draw()
        userFrog2.draw()
        pond.draw()
        // TBD: animate spectator frogs 
        AudiencePack.goToNextFrameAllAudiences();
        AudiencePack.drawAllAudiences();
     


        // Randomly update the coordinates of marbles in server, then draw
        Socket.randomizeMarbles(pondDimensions) // This also called the updateMarbles function
        drawMarbles()

        // Check if a user has reached pointsToWin
        Socket.checkIfAnyUserHasWon()

        // Game over conditions
        if (timeRemaining <= 0 || Object.keys(marbles).length == 0 || hasAnyUserWon){

            

            
            timePanel.updateTimer("0")
            pond.disableClickablePond()
            sounds.background.pause()
            sounds.gameover.play()
            SummaryController.showPage(Math.floor(timeRemaining));
            gameOverHandler()
            return
        }

        // Looping
        requestAnimationFrame(doFrame)
    }

    const gameOverHandler = () => {

        
        
        
        writeTextToTextBox("Game Over !!!")
        


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
        // Note: the "user" is only for getting the user.playerNo. The props in the user object are not updated.
        sounds.shoot.play()

        let addedPoints = 0;
        let marblesToRemove = []

        for (let [marbleId, marble] of Object.entries(marbles)){
            const {currX:circleX, currY:circleY, size:radius} = marble.getMarbleXYR()
            let eat = checkOverlap(circleX, circleY, radius, points[0], points[1], points[2], points[3])
            if (eat) {
                addedPoints += marble.getMarblePoints()
                marblesToRemove.push(marbleId)
                if (marble.getColor() == "blue"){
                    Socket.setUserFreezeAbility(user, true)
                }
            }
        }

        Socket.addUserPoints(user, addedPoints)
        Socket.deleteMarbles(marblesToRemove)

        // sounds.shoot.pause()

    }

    const writeTextToTextBox = (text) => {
        $("#game-arena-text-box").text(text)
    }


    return { startGame, drawTongueOnCanvas, loadMarbles, updateMarbles, handleShootTongueToTarget, deleteMarbles, freezeUserFrog, unFreezeUserFrog, toggleDoublePointsFrogImage, setHasAnyUserWon, resetGameSettings, writeTextToTextBox }
})();