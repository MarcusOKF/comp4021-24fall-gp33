const AbilityPanel = (function(){


    const refreshUserAbilityPanel = (user) => {
        let targetPanel;
        if (user.playerNo == 1) targetPanel = $("#p1-ability-panel")
        if (user.playerNo == 2) targetPanel = $("#p2-ability-panel")

        // Empty all children
        targetPanel.empty()

        targetPanel.append(`<div>Player ${user.playerNo}: ${user.name}</div>`)
        targetPanel.append(`<div>No ability</div>`)

    }

    return { refreshUserAbilityPanel }
})()