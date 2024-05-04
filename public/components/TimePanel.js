const TimePanel = (function(){

    const updateTimer = (seconds) => {
        if (seconds){
            let timePanel = $("#timer")

            timePanel.empty()
    
            timePanel.append(`<div style="font-size:60px; color:${seconds <= 10 ? "red" : "black"}">${seconds}</div>`)
            timePanel.append(`<div style="color:${seconds <= 10 ? "red" : "black"}">Second(s) left</div>`)
        }
    }

    const updateStartGameTimer = (seconds) => {
        if (seconds){
            const countdownDivHTML = `<div style="font-size:80px; color:red">${seconds}</div>`
            
            $("#timer").empty()
            $("#timer").append(countdownDivHTML)

            $("#p1-ability-panel").empty()
            $("#p1-ability-panel").append(countdownDivHTML)


            $("#p2-ability-panel").empty()
            $("#p2-ability-panel").append(countdownDivHTML)


            $("#p1-points-panel").empty()
            $("#p1-points-panel").append(countdownDivHTML)


            $("#p2-points-panel").empty()
            $("#p2-points-panel").append(countdownDivHTML)

        }
    }

    const emptyPanel = () => {
        $("#timer").empty()
    }


    return { updateTimer, updateStartGameTimer, emptyPanel }
})()