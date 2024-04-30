/*
    ctx: canvas context
    x: x_position on canvas
    y: y_position on canvas
*/
const Pond = (ctx, x, y) => {

    const draw = () => {
        ctx.beginPath()
        ctx.lineWidth = 5; // Border width
        ctx.roundRect(x, y, 700, 450, 100)
        ctx.fillStyle = '#BEE9EF'; /* Replace with your desired background color */
        ctx.strokeStyle = "black"; // Border color
        ctx.stroke()
        ctx.fill()
    }

    const checkPointIsInPond = (targetX,targetY) => {

        ctx.beginPath()
        ctx.roundRect(x, y, 700, 450, 100) // The x,y here is the position of Pond in canvas

        return ctx.isPointInPath(targetX, targetY)
    }

    return { draw, checkPointIsInPond }
};