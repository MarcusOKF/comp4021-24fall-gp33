// Controll interactions of the game

const GameController = (function() {
    let canvas;
    let context;
    let userFrog1, userFrog2;
    let pond;
    let spectatorFrogs = [];
    let marbles = []

    console.log("Build GC")

    const startGame = () => {
        canvas = $("#game-arena-canvas")
        context = canvas.get(0).getContext("2d")

        // Give background color
        context.fillStyle = '#755E56'; /* Replace with your desired background color */
        context.fillRect(0, 0, canvas.get(0).width, canvas.get(0).height);

        // GET online users
        fetchData("/onlineUsers")
        .then(users => {
            let p1 = users.find(u => u.playerNo == 1)
            let p2 = users.find(u => u.playerNo == 2)
            if (p1 && p2){
                // Load the UserFrogs
                userFrog1 = UserFrog(context, canvas.get(0).width/2, 10, p1)
                userFrog1.draw("n")
                userFrog2 = UserFrog(context, canvas.get(0).width/2, canvas.get(0).height-80, p2)
                userFrog2.draw("n")

                // Load the pond, and relate the two frogs to the pond.
                pond = Pond(canvas, context, 75, 100, userFrog1, userFrog2)
                pond.draw()                       
            }
        })  
    }

    const drawTongueOnCanvas = (points) => {
        // It must need to be this order
        const point1 = points[0]
        const point2 = points[1]
        const point3 = points[2]
        const point4 = points[3]

        context.lineWidth = 2;

        // Begin the path
        context.beginPath();

        // Move to the first point
        context.moveTo(point1.x, point1.y);

        // Connect the remaining points with lines
        context.lineTo(point2.x, point2.y);
        context.lineTo(point3.x, point3.y);
        context.lineTo(point4.x, point4.y);

        // Close the shape by connecting the last point to the first point
        context.closePath();

        // Stroke or fill the shape
        context.stroke(); // Use stroke() to draw the outline of the shape
        context.fillStyle = "red";
        context.fill(); // Use fill() to fill the shape with color
        // Try try a line
    }

    

    return { startGame, drawTongueOnCanvas }
})();