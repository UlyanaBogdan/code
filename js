 //board
  let board;
  let boardWidth = 750;
  let boardHeight = 250;
  let context;

  //dino
  let dinoWidth = 88;
  let dinoHeight = 94;
  let dinoX = 50;
  let dinoY = boardHeight - dinoHeight;
  let dinoImg;

  let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
  }

  //cactus
  let cactusArray = [];

  let cactus1Width = 34;
  let cactus2Width = 69;
  let cactus3Width = 102;

  let cactusHeight = 70;
  let cactusX = 700;
  let cactusY = boardHeight - cactusHeight;

  let cactus1Img;
  let cactus2Img;
  let cactus3Img;


  //physics
  let velocityX = -8; //cactus moving left speed
  let velocityY = 0;
  let gravity = 0.4;

  let gameOver = false;
  let score = 0;

  document.addEventListener('DOMContentLoaded', drawStart);
  function drawStart() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board


    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function () {
      context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";
  }

  const startGameBtn = document.querySelector('.start-game-btn');
  startGameBtn.addEventListener('click', startGame);

  function startGame() {
    resetGame();
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener('keydown', moveDino);
    startGameBtn.setAttribute('disabled', 'disabled');
  }
  function resetGame() {
    context.clearRect(0, 0, board.width, board.height);
    dino.x = dinoX;
    dino.y = dinoY;
    velocityY = 0;
    gravity = 0.4;
    velocityX = -8;
    gameOver = false;
    score = 0;
    cactusArray = [];
    dinoImg.src = "./img/dino.png";
    startGameBtn.removeAttribute('disabled');
  }
  function update() {
    requestAnimationFrame(update);
    if (gameOver) {
      return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
      let cactus = cactusArray[i];
      cactus.x += velocityX;
      context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

      if (detectCollision(dino, cactus)) {
        startGameBtn.removeAttribute('disabled');
        gameOver = true;
        dinoImg.src = "./img/dino-dead.png";
        dinoImg.onload = function() {
          context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        }
      }
    }

    //score
    context.fillStyle = "black";
    context.font = '20px courier';
    score++;
    context.fillText(score, 5, 20);

  }

  function moveDino(e){
    if (gameOver) {
      return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
      //jump
      velocityY = -10;
    }
  }

  function placeCactus() {
    if (gameOver) {
      return;
    }
    //place cactus
    let cactus = {
      img: null,
      x: cactusX,
      y: cactusY,
      width: null,
      height: cactusHeight,
    }

    let placeCactusChance = Math.random();

    if( placeCactusChance > .90 ) {
      cactus.img = cactus3Img;
      cactus.width = cactus3Width;
      cactusArray.push(cactus);
    } else if ( placeCactusChance > 0.70 ) {
      cactus.img = cactus2Img;
      cactus.width = cactus2Width;
      cactusArray.push(cactus);
    } else if ( placeCactusChance > 0.50 ) {
      cactus.img = cactus1Img;
      cactus.width = cactus1Width;
      cactusArray.push(cactus);
    }

    if (cactusArray.length > 5 ) {
      cactusArray.shift();
    }
  }

  function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
  }
