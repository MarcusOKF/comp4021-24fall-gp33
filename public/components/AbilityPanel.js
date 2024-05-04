const AbilityPanel = (function(){


    const refreshUserAbilityPanel = (user) => {
        let targetPanel;
        if (user.playerNo == 1) targetPanel = $("#p1-ability-panel")
        if (user.playerNo == 2) targetPanel = $("#p2-ability-panel")

        // Empty all children
        targetPanel.empty()

        targetPanel.append(`<div>Player ${user.playerNo}: ${user.name}</div>`)
        targetPanel.append(`<div style="font-size:30px;">Cooldown: ${user.cooldown}</div>`)
        targetPanel.append(`<div style="font-size:30px; color:${user.hasFreezeAbility ? "blue" : "grey"}">🧊Freeze Ability</div>`)
        targetPanel.append(`<div style="font-size:30px; color:${user.isFrozen ? "blue" : "grey"}">🥶Frozen</div>`)
        if (user.isDoublePoints) targetPanel.append(`<div style="font-size:30px; color:${user.isDoublePoints ? "red" : "grey"}">🔥Double Points</div>`)

    }

    const emptyPanels = () => {
        $("#p1-ability-panel").empty()
        $("#p2-ability-panel").empty()
    }

    return { refreshUserAbilityPanel, emptyPanels }
})()