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


        // Looping
        requestAnimationFrame(doFrame)
    }

    // const drawTongueOnCanvas = (points) => {
    //     // It must need to be this order
    //     const point1 = points[0]
    //     const point2 = points[1]
    //     const point3 = points[2]
    //     const point4 = points[3]

    //     context.lineWidth = 2;

    //     // Begin the path
    //     context.beginPath();

    //     // Move to the first point
    //     context.moveTo(point1.x, point1.y);

    //     // Connect the remaining points with lines
    //     context.lineTo(point2.x, point2.y);
    //     context.lineTo(point3.x, point3.y);
    //     context.lineTo(point4.x, point4.y);

    //     // Close the shape by connecting the last point to the first point
    //     context.closePath();

    //     // Stroke or fill the shape
    //     context.stroke(); // Use stroke() to draw the outline of the shape
    //     context.fillStyle = "red";
    //     context.fill(); // Use fill() to fill the shape with color
    //     // Try try a line
    // }

    const drawTongueOnCanvas = (points) => {
        // From side: points[0] - points[1]
        // To side: points[2] - points[3]

        const animationFrames = 100; // Number of frames for the animation
        const deltaX = (points[2].x - points[0].x) / animationFrames; // Amount to increment x per frame
        const deltaY = (points[2].y - points[0].y) / animationFrames; // Amount to increment y per frame
        
        let currentFrame = 0;
        
        function animate() {
            // Clear canvas
            // context.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height);
        
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
            } else {

            }


        }
        
        animate();
    }



    return { startGame, drawTongueOnCanvas }
})();