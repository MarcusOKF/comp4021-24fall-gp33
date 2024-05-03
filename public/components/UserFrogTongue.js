const UserFrogTongue = (ctx, x, y, user) => {

    const drawRefPoint = () => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    // This function draws a shape, given (x,y) and (targetX, targetY)
    const shootTongueToTarget = (targetX, targetY) => {
        const tongueWidth = 25

        var point1 = { x: x-tongueWidth/2 , y: y };
        var point2 = { x: x+tongueWidth/2, y: y };
        var point3 = { x: targetX-tongueWidth/2, y: targetY };
        var point4 = { x: targetX+tongueWidth/2, y: targetY };

        // Also shows the shoot tongue animation to the other player
        Socket.drawTongue([point1, point2, point3, point4])

        // Handle the calculation of shoot tongue
        GameController.handleShootTongueToTarget([point1, point2, point3, point4], user)
    }

    // const checkPointIsInTongue = (targetX,targetY, ctx) => {

    // }

    return { drawRefPoint, shootTongueToTarget }
}