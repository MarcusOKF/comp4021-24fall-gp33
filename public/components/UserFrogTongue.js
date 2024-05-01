const UserFrogTongue = (ctx, x, y, user) => {

    const drawRefPoint = () => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    // This function draws a shape, given (x,y) and (targetX, targetY)
    const shootTongueToTarget = (targetX, targetY) => {
        const tongueWidth = 20

        var point1 = { x: x-tongueWidth/2 , y: y };
        var point2 = { x: x+tongueWidth/2, y: y };
        var point3 = { x: targetX+tongueWidth/2, y: targetY };
        var point4 = { x: targetX-tongueWidth/2, y: targetY };
        ctx.lineWidth = 2;

        // Begin the path
        ctx.beginPath();

        // Move to the first point
        ctx.moveTo(point1.x, point1.y);

        // Connect the remaining points with lines
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.lineTo(point4.x, point4.y);

        // Close the shape by connecting the last point to the first point
        ctx.closePath();

        // Stroke or fill the shape
        ctx.stroke(); // Use stroke() to draw the outline of the shape
        ctx.fillStyle = "red";
        ctx.fill(); // Use fill() to fill the shape with color
        // Try try a line

    }

    return { drawRefPoint, shootTongueToTarget }
}