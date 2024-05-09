const UserFrogTongue = (ctx, x, y, user) => {
    let coolDownSeconds = 2 //Note: Actually it is coolDownSeconds+1
    coolDownSeconds -= 1 // Adjustment
    let isCooldown = false
    let frozen = false

    const drawRefPoint = () => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    // This function draws a shape, given (x,y) and (targetX, targetY)
    const shootTongueToTarget = (targetX, targetY) => {
        // Handle frozen
        if (frozen) {
            console.log("Frozen")
            return
        }

        // Handle cooldown
        if (isCooldown) {
            console.log("Cooling down...")
            return
        }
        handleCooldownLoop()

        // Tongue logic
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

    const handleCooldownLoop = () => {
        isCooldown = true
        function countdown(seconds) {

            Socket.updateCooldown(user, seconds+1)

            var interval = setInterval(function() {
                Socket.updateCooldown(user, seconds)
                seconds--;
                if (seconds < 0) {
                    clearInterval(interval);
                    isCooldown = false
                }
            }, 1000);
        }
            
        countdown(coolDownSeconds);   
    }

    const freezeTongue = () => {
        frozen = true
    }

    const unFreezeTongue = () => {
        frozen = false
    }

    const frogIsFrozen = () => {
        return frozen
    }

    return { drawRefPoint, shootTongueToTarget, freezeTongue, unFreezeTongue, frogIsFrozen }
}