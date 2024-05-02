// Controll interactions of the game

const GameController = (function() {
    let canvas;
    let context;
    let userFrog1, userFrog2;
    let pond;
    let spectatorFrogs = [];
    let marbles = []


    const startGame = () => {
        canvas = $("#game-arena-canvas")
        context = canvas.get(0).getContext("2d")

        // Load the game objects
        fetchData("/onlineUsers")
        .then(users => {
            let p1 = users.find(u => u.playerNo == 1)
            let p2 = users.find(u => u.playerNo == 2)
            if (p1 && p2){
                // Load the UserFrogs
                userFrog1 = UserFrog(context, canvas.get(0).width/2, 10, p1)
                userFrog1.loadFrog("n")
                userFrog2 = UserFrog(context, canvas.get(0).width/2, canvas.get(0).height-80, p2)
                userFrog2.loadFrog("n")

                // Load the pond, and relate the two frogs to the pond.
                pond = Pond(canvas, context, 75, 100, userFrog1, userFrog2)
                pond.draw()        
                
                // Generate Marbels in the pond, should be on server side ?
                const {x, y, width, height} = pond.getPondParams()

                marbles.push(Marble(context, x+100, y+100, "red"))
                for (let marble of marbles){
                    marble.draw()
                }
            }
        })

        // Start main game loop after X seconds, to make sure the stuff is loaded
        setTimeout(() => {
            requestAnimationFrame(doFrame)
        }, 3000)

    }

    const doFrame = (now) => {
        // Clear the context
        context.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height);

        // Draw the objects
        userFrog1.draw()
        userFrog2.draw()
        pond.draw()

        for (let marble of marbles){
            marble.draw()
        }
        

        // Looping
        requestAnimationFrame(doFrame)
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
        
            currentFrame++;
        
            if (currentFrame < animationFrames+1) {
                requestAnimationFrame(animate);
            } 
        }
        
        animate();
    }



    return { startGame, drawTongueOnCanvas }
})();