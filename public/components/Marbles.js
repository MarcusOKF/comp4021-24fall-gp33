const Marble = (ctx, x, y, color, points, size, speedX, speedY) => {
    let currX = x; 
    let currY = y;

    const getMarblePoints = () => {
        return points
    }
    
    const draw = () => {
        ctx.beginPath();
        ctx.arc(currX, currY, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.stroke()
        ctx.fill();
    }

    const updateMarblePosition = (targetX, targetY) => {
        currX = targetX
        currY = targetY
    }

    return { draw, getMarblePoints, updateMarblePosition }
}