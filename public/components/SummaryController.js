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
      const { score1, score2, score1PerTime, score2PerTime } = data
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
      // reset
      setTimeout(Socket.resetGameSettings(), 500);
    };
    
  
    // Attach click event handlers to the buttons
    $('#Restart-button').on('click', restartButtonClick);
    $('#Title-button').on('click', titleButtonClick);

    hidePage();
  
    return { writedata,retrievedata, hidePage, showPage };
  })();