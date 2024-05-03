const PointsPanel = (function(){

    const refreshUserPointsPanel = (user) => {
        let targetPanel;
        if (user.playerNo == 1) targetPanel = $("#p1-points-panel")
        if (user.playerNo == 2) targetPanel = $("#p2-points-panel")

        // Empty all children
        targetPanel.empty()

        targetPanel.append(`<div>Player ${user.playerNo}: ${user.name}</div>`)
        targetPanel.append(`<div style="font-size:70px">${user.points}</div>`)
        targetPanel.append(`<div>Point(s)</div>`)

    }

    return { refreshUserPointsPanel }
})()