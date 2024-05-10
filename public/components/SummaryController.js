const SummaryController = (function () {

    // data




    const hidePage = function () {
      $('#Page3').hide();
    };
  
    const showPage = function (timeremaininseconds) {
      $('#Page3').show();
      $('#successmessage').hide();
      retrievedata(timeremaininseconds);
      
   
      
    };
  
    const restartButtonClick = function () {
        
        $('#successmessage').show();
        Socket.joinPlayerRematch(1);
        
        
    };
  
    const titleButtonClick = function () {
        
        hidePage();
        UI.showFrontPage();
    };

    const retrievedata = function (timeremaininseconds) {
      const id = Authentication.getPlayerID();
      if (id == 1){
        Socket.getdataone(60-timeremaininseconds);
      }
      

    };

    const writedata = function(data){
      const { score1, score2, score1PerTime, score2PerTime, leaderboardOutput } = data
      const id = Authentication.getPlayerID();
      if (id === 1){
        $('#info1').text(score1);
        $('#info2').text(score2);
        $('#info3').text(score1PerTime);
      }
      else{
        $('#info1').text(score2);
        $('#info2').text(score1);
        $('#info3').text(score2PerTime);
      }

      const leaderboardDataArray = leaderboardOutput.split(" ");
      console.log(leaderboardDataArray);
      const leaderboardData = [];
      for (let i = 0; i < leaderboardDataArray.length && i < 10; i += 2) {
        const position = leaderboardDataArray[i];
        const time = leaderboardDataArray[i + 1];
        leaderboardData.push({ position, time });
      }
      console.log(leaderboardData);
      document.getElementById("player1").textContent = leaderboardData[0].position;
  document.getElementById("time1").textContent = leaderboardData[0].time;
  document.getElementById("player2").textContent = leaderboardData[1].position;
  document.getElementById("time2").textContent = leaderboardData[1].time;
  document.getElementById("player3").textContent = leaderboardData[2].position;
  document.getElementById("time3").textContent = leaderboardData[2].time;
  document.getElementById("player4").textContent = leaderboardData[3].position;
  document.getElementById("time4").textContent = leaderboardData[3].time;
  document.getElementById("player5").textContent = leaderboardData[4].position;
  document.getElementById("time5").textContent = leaderboardData[4].time;
      // reset
      setTimeout(Socket.resetGameSettings(), 2400);
    };
    
  
    // Attach click event handlers to the buttons
    $('#Restart-button').on('click', restartButtonClick);
    $('#Title-button').on('click', titleButtonClick);

    hidePage();
  
    return { writedata,retrievedata, hidePage, showPage };
  })();