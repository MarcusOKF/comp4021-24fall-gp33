const TimePanel = (function(){

    const updateTimer = (seconds) => {
        const svg = document.getElementById("timer");
        if (svg) {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", "100");
            circle.setAttribute("cy", "100");
            circle.setAttribute("r", "90");
            circle.setAttribute("fill", "#FFFFFF");
            circle.setAttribute("stroke", "#000000");
            circle.setAttribute("stroke-width", "5");

            const pointer = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const angle = (seconds / 60) * 360; // Calculate the angle based on the provided seconds
            const radius = 85;

            const startAngle = -90; // Start angle for the pie
            const endAngle = startAngle + angle;

            const startRadians = (startAngle * Math.PI) / 180;
            const endRadians = (endAngle * Math.PI) / 180;

            const startX = 100 + radius * Math.cos(startRadians);
            const startY = 100 + radius * Math.sin(startRadians);
            const endX = 100 + radius * Math.cos(endRadians);
            const endY = 100 + radius * Math.sin(endRadians);

            const largeArcFlag = angle > 180 ? "1" : "0";

            const pathData = `M 100,100 L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
            
            pointer.setAttribute("d", pathData);
            pointer.setAttribute("fill", "#FF0000"); // Red pointer

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", "50%");
            text.setAttribute("y", "50%");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("alignment-baseline", "central");
            text.setAttribute("font-size", "48");
            text.setAttribute("fill", seconds <= 10 ? "#FF0000" : "#000000");
            text.textContent = Math.ceil(seconds).toString();

            // Remove existing children before adding new elements
            while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
            }

            svg.appendChild(circle);
            svg.appendChild(pointer);
            svg.appendChild(text);
        }
    }

    const updateStartGameTimer = (seconds) => {
        if (seconds){
            const countdownDivHTML = `<div style="font-size:80px; color:red">${seconds}</div>`
            

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
        const timerElement = document.getElementById("timer");
        if (timerElement) {
            while (timerElement.firstChild) {
            timerElement.removeChild(timerElement.firstChild);
            }
        }
    }


    return { updateTimer, updateStartGameTimer, emptyPanel }
})()