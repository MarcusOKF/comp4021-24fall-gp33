const UserFrogTongue = (ctx, x, y) => {
    // Ref point (x,y)

    const drawRefPoint = () => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    const shootTongueToTarget = (targetX, targetY) => {
        alert(`Click on (${targetX}, ${targetY})`)
    }

    return { drawRefPoint, shootTongueToTarget }
}