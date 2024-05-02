/*
    ctx: canvas context
    x: middle point x of the Frog
    y: middle point y of the Frog
*/
const UserFrog = (ctx, x, y, user) => {
    const imageWidth = 70
    const imageHeight = 70
    let userFrogTongue;
    let frog;

    // Construct tongue when create object
    userFrogTongue = UserFrogTongue(ctx, x, y+imageHeight/2, user)

    // Draws the Frog, Tongue and User Name
    const draw = () => {
        // Draw Frog
        ctx.clearRect(x-imageWidth/2, y, imageWidth, imageHeight);
        ctx.drawImage(frog, x-imageWidth/2, y, imageWidth, imageHeight);

        // Draw Tongue Ref point
        userFrogTongue.drawRefPoint()

        // Draw Name
        ctx.font = "20px Arial"
        ctx.fillText(`Player ${user.playerNo}:`, x+100, y+imageHeight/2)
        ctx.font = "20px Arial"
        ctx.fillText(`${user.name}`, x+100, y+imageHeight)
    }

    const loadFrog = (status) => {
        frog = new Image()
        frog.onload = function () { 
            draw()
        }
        if (status == "n"){
            frog.src = "../assets/normal_frog.png"
        } else if (status == "a") {
            frog.src = "../assets/angry_frog.png"
        } else if (status == "s"){
            frog.src = "../assets/sad_frog.png"
        } else {
            frog.src = "../assets/normal_frog.png"
        }
    }


    return { userFrogTongue, draw, loadFrog }
};
