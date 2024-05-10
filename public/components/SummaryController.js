const SummaryController = (function () {






    const hidePage = function () {
      $('#Page3').hide();
    };
  
    const showPage = function () {
      $('#Page3').show();
    };
  
    const restartButtonClick = function () {
       Socket.joinPlayerRematch(1);
    };
  
    const titleButtonClick = function () {
        hidePage();
        UI.showFrontPage();
    };
  
    // Attach click event handlers to the buttons
    $('#Restart-button').on('click', restartButtonClick);
    $('#Title-button').on('click', titleButtonClick);

    hidePage();
  
    return { hidePage, showPage };
  })();