const AudiencePack = (() => {
    // Private variables and functions
    const audiences = [];
    const topLeftX1 = 0; 
    const topLeftY1 = 15; 
    const topLeftX2 = 800-80; 
    const topLeftY2 = 15; 
    const audienceWidth = 80;
    const audienceHeight = 72;
    const numRows = 8;
    const numCols = 1;


    function seededRandom(seed) {
        let value = seed % 2147483647;
      
        return () => {
          value = (value * 16807) % 2147483647;
          return value / 2147483647;
        };
      }
    const seed = 12345;
    const random = seededRandom(seed);
  
    function Audience(ctx, x, y, type) {
        const spriteWidth = 128;
        const spriteHeight = 120;
        const spriteSheetWidth = 1024;
        const spriteSheetHeight = 1619;
        const totalFrames = 8;
        let Framestilmove = 0;

        const picturePerFrame = 10;
    
        let currX = x;
        let currY = y;
        let currentFrame = Math.floor(random() * totalFrames);
    
        const draw = () => {
          const spriteX = currentFrame * spriteWidth;
          const spriteY = spriteSheetHeight - spriteHeight - (type - 1) * spriteHeight;
    
          ctx.drawImage(
            spriteSheetImage,
            spriteX,
            spriteY,
            spriteWidth,
            spriteHeight,
            currX,
            currY,
            audienceWidth,
            audienceHeight
          );
        };
    
        const goToNextFrame = () => {
            Framestilmove = (Framestilmove + 1) % picturePerFrame;
            if(!Framestilmove){
                currentFrame = (currentFrame + 1) % totalFrames;
            }
        };
    
        return {
          draw,
          goToNextFrame
        };
      }
  
    // Public methods of the AudiencePack
    const createAudience = (ctx, x, y, type) => {
      const audience = new Audience(ctx, x, y, type);
      audiences.push(audience);
      return audience;
    };
  
    const goToNextFrameAllAudiences = () => {
      audiences.forEach(audience => {
        audience.goToNextFrame();
      });
    };
  
    const drawAllAudiences = () => {
      audiences.forEach(audience => {
        audience.draw();
      });
    };
    
    // Load sprite sheet image
    const spriteSheetImage = new Image();
    spriteSheetImage.src = '../assets/audience.png';
    spriteSheetImage.onload = () => {
        // nothing to do
    };

    function initializeAudiences(ctx) {
        let currentX = topLeftX1;
        let currentY = topLeftY1;
    
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const type = Math.floor(random() * 6) + 1;
            createAudience(ctx, currentX, currentY, type);
            currentX += audienceWidth;
          }
          currentX = topLeftX1;
          currentY += audienceHeight;
        }

        currentX = topLeftX2;
        currentY = topLeftY2;
    
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const type = Math.floor(random() * 6) + 1;
            createAudience(ctx, currentX, currentY, type);
            currentX += audienceWidth;
          }
          currentX = topLeftX2;
          currentY += audienceHeight;
        }
    }

    const removeAllAudiences = () => {
        audiences.length = 0;
    };
  
    // Return an object with public methods
    return {
      createAudience,
      goToNextFrameAllAudiences,
      drawAllAudiences,
      initializeAudiences,
      removeAllAudiences
    };
  })();
  
  