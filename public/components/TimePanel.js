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
            let timePanel = $("#timer")
            timePanel.empty()
            timePanel.append(`<div style="font-size:80px; color:red">${seconds}</div>`)
        }
    }


    return { updateTimer, updateStartGameTimer }
})()