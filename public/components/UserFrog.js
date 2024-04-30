/*
    ctx: canvas context
    x: x_position on canvas
    y: y_position on canvas
*/
const UserFrog = (ctx, x, y) => {
    const normalFrog = "../assets/normal_frog.png"
    const angryFrog = "../assets/angry_frog.png"
    const sadFrog = "../assets/sad_frog.png"
    const imageWidth = 100
    const imageHeight = 100
    let userFrogTongue;

    // Construct tongue when create object
    userFrogTongue = UserFrogTongue(ctx, x+imageWidth/2, y+imageHeight/2)

    const draw = (status) => {
        let frog = new Image()
        frog.onload = function () { 
            ctx.clearRect(x, y, imageWidth, imageHeight);
            ctx.drawImage(frog, x, y, imageWidth, imageHeight);
            userFrogTongue.drawRefPoint()
        }
        if (status == "n"){
            frog.src = normalFrog
        } else if (status == "a") {
            frog.src = angryFrog
        } else if (status == "s"){
            frog.src = sadFrog
        } else {
            frog.src = normalFrog
        }
    }



    return { userFrogTongue, draw }
};
