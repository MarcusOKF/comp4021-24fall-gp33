/*
    cv: canvas
    ctx: canvas context
    x: x_position on canvas
    y: y_position on canvas
*/
const Pond = (cv, ctx, x, y, userFrog1, userFrog2) => {
    let clickable = false

    const drawParms = {x, y, width: cv.get(0).width-x*2, height: cv.get(0).height-y*2, radius: 0}

    const draw = (text) => {
        ctx.beginPath()
        ctx.lineWidth = 5; // Border width
        ctx.roundRect(drawParms.x, drawParms.y, drawParms.width, drawParms.height, drawParms.radius)
        ctx.fillStyle = '#BEE9EF'; /* Replace with your desired background color */
        ctx.strokeStyle = "black"; // Border color
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        if (text){
            console.log(text)
            ctx.font = "50px Arial"
            ctx.fillStyle = "red"
            ctx.fillText(`${text}`, drawParms.x + drawParms.width/2-70, drawParms.y + drawParms.height/2)
        } 
    }

    const checkPointIsInPond = (targetX,targetY) => {

        ctx.beginPath()
        ctx.roundRect(drawParms.x, drawParms.y, drawParms.width, drawParms.height, drawParms.radius) // The x,y here is the position of Pond in canvas

        return ctx.isPointInPath(targetX, targetY)
    }

    cv.on("click", function(e){
        let offset = cv.eq(0).offset();
        let targetX = e.pageX-offset.left
        let targetY = e.pageY-offset.top
        if (checkPointIsInPond(targetX, targetY) && clickable){
            // For now lets say the session user is player 1
            const user = { playerNo: Authentication.getPlayerID() } // Auth.getUser()
            console.log('user.playerNo: ', user.playerNo)
            if (user.playerNo == 1){
                userFrog1.userFrogTongue.shootTongueToTarget(targetX, targetY)
            } else if (user.playerNo == 2){
                userFrog2.userFrogTongue.shootTongueToTarget(targetX, targetY)
            }
        }
    })

    const getPondParams = () => {
        return drawParms
    }

    const enableClickablePond = () => {
        clickable = true
    }

    const disableClickablePond = () => {
        clickable = false
    }

    return { draw, checkPointIsInPond, getPondParams, enableClickablePond, disableClickablePond }
};