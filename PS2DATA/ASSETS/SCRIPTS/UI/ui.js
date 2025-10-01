class MenuManagerClass {
    constructor() {}

    ps2Update() {
        const ps2Image = new ImageManager("PS2DATA/ASSETS/LOGO/ps2logo.png");
        
        let alpha = 0;
        let phase = 1; 
        const fadeSpeed = 0.02;
        let pauseTimer = null;
        const pauseDuration = 3000;
        
        renderScreen(() => {
            if (phase === 1) {
                if (alpha < 1) {
                    alpha += fadeSpeed;
                    alpha = Math.min(alpha, 1);
                } else {
                    if (!pauseTimer) {
                        pauseTimer = Date.now();
                    }
                    
                    if (Date.now() - pauseTimer >= pauseDuration) {
                        phase = 2;
                    }
                }
            } else if (phase === 2) {
                if (alpha > 0) {
                    alpha -= fadeSpeed;
                    alpha = Math.max(alpha, 0);
                } else {
                    SceneManager.load(MenuManager.logoUpdate);
                    return;
                }
            }
            
            ps2Image.color = Color.new(255, 255, 255, alpha * 128);
            ps2Image.draw((640 - ps2Image.width) / 2, (448 - ps2Image.height) / 2); 
        });
    }
    
    logoUpdate() {
        const eclipseSound = new StreamManager("PS2DATA/ASSETS/LOGO/eclipsesound.wav");
        const logo = new ImageManager("PS2DATA/ASSETS/LOGO/eclipse.png");
        const eclipsetext = new ImageManager("PS2DATA/ASSETS/LOGO/eclipsetext.png");

        let width = 594;
        let height = 634;
        const initialTargetWidth = 164;
        const initialTargetHeight = 204;
        const screenWidth = 640;
        const screenHeight = 448;
        const finalX = 40;

        const finalWidth = 194;
        const finalHeight = 234;

        let x = (screenWidth - width) / 2;
        let y = (screenHeight - height) / 2;

        let phase = 1;
        let showText = false;
        let textAlpha = 0;
        let logoAlpha = 0;
        const fadeSpeed = 0.01;
        let pauseTimer = 0;

        let fadeOutAlpha = 0;
        const fadeOutSpeed = 3;
        let textShownTime = null;

        let startX = x;
        let startWidth = initialTargetWidth;
        let startHeight = initialTargetHeight;

        const totalMoveFrames = Math.abs(startX - finalX) / 3;
        let moveProgress = 0;

        let eclipseSoundPlayed = false;

        const fadeInLogo = () => {
            if (logoAlpha < 1) {
                logoAlpha += fadeSpeed;
                logoAlpha = Math.min(logoAlpha, 1);
            }
        };

        const fadeInText = () => {
            if (textAlpha < 1) {
                textAlpha += fadeSpeed;
                textAlpha = Math.min(textAlpha, 1);
            }
        };

        renderScreen(() => {
            if (phase === 1) {
                fadeInLogo();

                if (!eclipseSoundPlayed) {
                    eclipseSound.play();
                    eclipseSoundPlayed = true;
                }

                if (width > initialTargetWidth) width -= 3;
                if (height > initialTargetHeight) height -= 3;

                width = Math.max(width, initialTargetWidth);
                height = Math.max(height, initialTargetHeight);

                x = (screenWidth - width) / 2;
                y = (screenHeight - height) / 2;

                if (width === initialTargetWidth && height === initialTargetHeight) {
                    phase = 2;
                    pauseTimer = Date.now();
                    x = (screenWidth - initialTargetWidth) / 2;
                    startX = x;
                }
            } else if (phase === 2) {
                fadeInLogo();

                if (Date.now() - pauseTimer >= 200) {
                    phase = 3;
                }

                if (Date.now() - pauseTimer < 1000) {
                    logo.color = Color.new(128, 128, 128, logoAlpha * 128);
                    logo.width = width;
                    logo.height = height;
                    logo.draw(x, y);
                    return;
                }
            } else if (phase === 3) {
                if (x > finalX) {
                    moveProgress += 0.01;
                    moveProgress = Math.min(moveProgress, 1);

                    x = startX + (finalX - startX) * moveProgress;
                    width = initialTargetWidth + (finalWidth - initialTargetWidth) * moveProgress;
                    height = initialTargetHeight + (finalHeight - initialTargetHeight) * moveProgress;

                    y = (screenHeight - height) / 2;
                } else {
                    x = finalX;
                    width = finalWidth;
                    height = finalHeight;
                    y = (screenHeight - height) / 2;

                    if (!showText) {
                        showText = true;
                        textShownTime = Date.now();
                    }
                }
            }

            logo.color = Color.new(128, 128, 128, logoAlpha * 128);
            logo.width = width;
            logo.height = height;
            logo.draw(x, y);

            if (showText) {
                fadeInText();
                eclipsetext.color = Color.new(255, 255, 255, textAlpha * 128);
                eclipsetext.draw(-30, 0);

                if (textShownTime && Date.now() - textShownTime >= 5000) {
                    if (fadeOutAlpha < 255) {
                        fadeOutAlpha += fadeOutSpeed;
                        if (fadeOutAlpha > 255) fadeOutAlpha = 255;
                        if (fadeOutAlpha >= 255) {
                            SceneManager.load(MenuManager.titleScreen);
                        }
                    }
                    Draw.rect(0, 0, 640, 448, Color.new(0, 0, 0, fadeOutAlpha));
                }
            }
        });
    }

titleScreen() {
    const titleLogo = new ImageManager("PS2DATA/ASSETS/SPRITES/title_Screen/bg.png");
    
    const fireFrames = [];
    for(let i = 0; i <= 23; i++) {
        fireFrames.push(new ImageManager(`PS2DATA/ASSETS/SPRITES/title_Screen/fire/${i}.png`));
    }
    
    const menuOptions = [
        new ImageManager("PS2DATA/ASSETS/SPRITES/title_Screen/1.png"),
        new ImageManager("PS2DATA/ASSETS/SPRITES/title_Screen/2.png"),
        new ImageManager("PS2DATA/ASSETS/SPRITES/title_Screen/3.png"),
        new ImageManager("PS2DATA/ASSETS/SPRITES/title_Screen/4.png"),
        new ImageManager("PS2DATA/ASSETS/SPRITES/title_Screen/5.png"),
        new ImageManager("PS2DATA/ASSETS/SPRITES/title_Screen/6.png")
    ];

    for(let i = 0; i < menuOptions.length; i++) {
        menuOptions[i].width = 640;
        menuOptions[i].height = 448;
    }

    let currentFrame = 0;
    let frameTimer = 0;
    const frameSpeed = 0.23;
    let selectedOption = 0;
    const maxOptions = menuOptions.length - 1;
    
    const bgMusic = new StreamManager("PS2DATA/ASSETS/SOUNDS/STREAM/menu.wav");
    let musicStarted = false;
    
    const pad = Pads.get(0);

    renderScreen(() => {
        if (!musicStarted) {
            bgMusic.play();
            bgMusic.loop = true;
            musicStarted = true;
        }

        frameTimer += frameSpeed;
        if (frameTimer >= 1) {
            currentFrame = (currentFrame + 1) % fireFrames.length;
            frameTimer = 0;
        }

        pad.update();

        if (pad.justPressed(Pads.LEFT) && selectedOption > 0) {
            selectedOption--;
        }
        
        if (pad.justPressed(Pads.RIGHT) && selectedOption < maxOptions) {
            selectedOption++;
        }

        if (pad.justPressed(Pads.CROSS)) {
            switch(selectedOption) {
                case 0:
                    SceneManager.load(MenuManager.transitionScreen);
                    break;
                case 1:
                    SceneManager.load(MenuManager.continueGame);
                    break;
                case 2:
                    SceneManager.load(MenuManager.optionsMenu);
                    break;
                case 3:
                    SceneManager.load(MenuManager.creditsScreen);
                    break;
                case 4:
                    System.exitToBrowser();
                    break;
                case 5:
                    break;
            }
        }
        
        fireFrames[currentFrame].draw(0, 192);
        
        const menuX = -52;
        const menuY = 55;
        menuOptions[selectedOption].draw(menuX, menuY);
        
        titleLogo.draw(0, 50);
    });
}

transitionScreen() {
    const cimaImage = new ImageManager("PS2DATA/ASSETS/SPRITES/ui/baixo.png");
    const baixoImage = new ImageManager("PS2DATA/ASSETS/SPRITES/ui/cima.png");
    const font = new Font("default");
    
    cimaImage.width = 640;
    cimaImage.height = 224;
    baixoImage.width = 640;
    baixoImage.height = 224;
    
    let cimaY = -224;
    let baixoY = 448;
    const moveSpeed = 8;
    let phase = 1;
    let pauseTimer = 0;
    
    renderScreen(() => {
        if (phase === 1) {
            if (cimaY < 0) {
                cimaY += moveSpeed;
                if (cimaY > 0) cimaY = 0;
            }
            
            if (baixoY > 224) {
                baixoY -= moveSpeed;
                if (baixoY < 224) baixoY = 224;
            }
            
            if (cimaY === 0 && baixoY === 224) {
                phase = 2;
                pauseTimer = Date.now();
            }
        } else if (phase === 2) {
            if (Date.now() - pauseTimer >= 2000) {
                phase = 3;
            }
        } else if (phase === 3) {
            if (cimaY > -224) {
                cimaY -= moveSpeed;
                if (cimaY < -224) cimaY = -224;
            }
            
            if (baixoY < 448) {
                baixoY += moveSpeed;
                if (baixoY > 448) baixoY = 448;
            }
            
            if (cimaY === -224 && baixoY === 448) {
                SceneManager.load(MenuManager.logoUpdate);
                return;
            }
        }
        
        cimaImage.draw(0, cimaY);
        baixoImage.draw(0, baixoY);
        
        if (phase === 2) {
            font.print(320, 224, "teste");
        }
    });
}

newGame() {
    const font = new Font("default");
    
    renderScreen(() => {
        font.print(50, 50, "New Game Screen");
    });
}
}
export const MenuManager = new MenuManagerClass();