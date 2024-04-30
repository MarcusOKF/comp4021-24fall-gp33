const GameArena = (function() {
    let userFrog1;
    let userFrog2;
    let pond;

    const initialize = () => {
        console.log("Building Game Arena...")
        const CANVAS_WIDTH = 890
        const CANVAS_HEIGHT = 750
        let arena = $("#game-arena")

        // Build a fixed sized canvas area
        arena.append(`<canvas id="game-arena-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>`)
        let canvas = $("#game-arena-canvas").get(0)
        let context = canvas.getContext("2d")


        // Give background color
        context.fillStyle = '#755E56'; /* Replace with your desired background color */
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Load frogs
        userFrog1 = UserFrog(context, 410, 15)
        userFrog1.draw("n")
        userFrog2 = UserFrog(context, 410, 630)
        userFrog2.draw("a")

        // Build the pond and onclick event
        pond = Pond(context, 100, 150)
        pond.draw()
        $("#game-arena-canvas").on("click", function(e){
            let offset = $("#game-arena-canvas").eq(0).offset();
            let targetX = e.pageX-offset.left
            let targetY = e.pageY-offset.top

            if (pond.checkPointIsInPond(targetX, targetY)){
                // For now use userFrog1 as refernce, maybe add a Contoller to control which user control which frog
                userFrog1.userFrogTongue.shootTongueToTarget(targetX, targetY)
            }
            
        })






    }

    return { initialize }
})();
