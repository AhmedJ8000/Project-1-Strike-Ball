//-------------------- CONSTANTS --------------------//
const paddleSpeed = 800; // Increased slightly for smoother control
const gameWidth = 800;
const gameHeight = 600;

//Canvas load for game.html
const canvas = document.querySelector("#gameCanvas");
const context = canvas ? canvas.getContext("2d") : null;
const levelButtons = document.querySelectorAll('.level-btn');
const savedLevel = localStorage.getItem("selectedLevel");

// Only run game logic if we are on game.html
const isGamePage = window.location.pathname.includes("game.html");

//-------------------- VARIABLES --------------------//
let ballSpeed = 5;
let ballAttached = true;   //Ball starts attached to paddle
let paddleDirection = 0; // -1 = left, 1 = right, 0 = stop
let ball = { x: 0, y: 0, dx: ballSpeed, dy: ballSpeed, radius: 8 };
let paddle = { x: 0, y: gameHeight - 40, width: 100, height: 15 };
let bricks = [];
let difficultyLevel = ["Easy", "Normal", "Hard"];
let score = 0;
let lives = 3;
let globalHitCount = 0;
let hitCount = 0;
let gameOver = false;
let currentLevel = 1;
let menuState = "title"; //Menu states for "title", "levelSelect", "options", "help", "inGame", and "High Scores"
let selectedLevel = 1;

// Load saved level
if (savedLevel) 
{
    currentLevel = parseInt(savedLevel);
}

//-------------------- FUNCTIONS --------------------//

//Initialize the game
function init() 
{
    if (!isGamePage || !canvas) return;

    //Reset ball position
    ball.x = gameWidth / 2;
    ball.y = gameHeight;

    //Reset paddle position
    paddle.x = gameWidth / 2 - paddle.width / 2;
    paddle.y = gameHeight - paddle.height - 10;

    //Load level from levels.js
    loadLevel(levels[currentLevel - 1]);

    //Initialize the game variables
    score = 0;
    lives = 2;
    gameOver = false;
    menuState = "inGame";

    // Start game loop
    requestAnimationFrame(gameLoop);
}

//Run the main game
function runGame() 
{
    moveBall();
    checkCollisions();
    renderHUD();
    renderGameElements();
}

function movePaddle() {
    paddle.x += paddleDirection * paddleSpeed * (1/60); //Paddle Speed per frame (scaled)
    
    //Keep the paddle inside the screen
    if (paddle.x < 0) 
    {
        paddle.x = 0;
    }

    if (paddle.x + paddle.width > gameWidth) 
    {
        paddle.x = gameWidth - paddle.width;
    }
}

if (ballAttached) 
{
    //Keep ball locked above the paddle
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius - 2;
}


//Move the ball
function moveBall() 
{
    ball.x += ball.dx;
    ball.y += ball.dy;
}


//Check collisions
function checkCollisions() 
{
// Wall collision (left/right)
if (ball.x - ball.radius < 0) 
{
    ball.x = ball.radius;   // move ball just outside the wall
    ball.dx *= -1;
}

if (ball.x + ball.radius > gameWidth) 
{
    ball.x = gameWidth - ball.radius; // move ball just inside
    ball.dx *= -1;
}

// Top wall collision
if (ball.y - ball.radius < 0) 
{
    ball.y = ball.radius;  // move ball just below the ceiling
    ball.dy *= -1;
}

    // Paddle collision
    if (
        ball.y + ball.radius > paddle.y && 
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x + ball.radius > paddle.x && 
        ball.x - ball.radius < paddle.x + paddle.width
       ) 
    {
        // Compute where on the paddle the ball hit
        let paddleCenterX = paddle.x + paddle.width / 2;
        let hitPos = (ball.x - paddleCenterX) / (paddle.width / 2);
        // hitPos is between -1 (left edge) and +1 (right edge)

        //Determine new direction
        //Keep speed constant:
        let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);

        //Set new dx based on hitPos
        let maxHorizontal = 0.8; //Proportion of speed that can go horizontal
        ball.dx = speed * hitPos * maxHorizontal;

        //Set new dy so that total speed remains constant, and ball goes upwards
        ball.dy = -Math.sqrt(speed * speed - ball.dx * ball.dx);

        //Ensure ball.dy is going up
        if (ball.dy > 0) 
        {
            ball.dy = -ball.dy;
        }
    }

    //Ball is out of bounds, when it falls into bottom under the paddle
    if (ball.y - ball.radius > gameHeight) 
    {
        //Check if the player has no lives left, then returning game over as true and return to title screen
        if (lives <= 0) 
        {
            gameOver = true;
            menuState = "title";  //Stop the loop
            console.log("Game over!");
            //Return to the title screen
            window.location.href = "../index.html";
        }
        else
        {
            //Deduct player's lives
            lives--;    
        }

        //Reattach the ball to paddle only if its not game over
        if (!gameOver)
        {
          //Reattach ball to paddle
          ballAttached = true;

          //Center ball on paddle next frame
          ball.dx = 0;
          ball.dy = 0;
        }

        //Reset vertical direction
        ball.dy = -Math.abs(ball.dy);

        //Reset horizontal direction to original
        ball.dx = ballSpeed * (Math.random() < 0.5 ? -1 : 1);
    }

    //Brick collisions
    bricks = bricks.filter(brick => 
    {
        const hit = ball.x + ball.radius > brick.x && 
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y && 
        ball.y - ball.radius < brick.y + brick.height;

    if (hit) 
    {
        ball.dy *= -1; //Simple bounce
        score += 10;
        hitCount += 1; //Counting every hit of the brick
        console.log("Hit Count: "+ hitCount)
        return false; //Removing the brick
    }
        return true;
    });

    const isWinner = bricks.every((brick)=> brick === 0)

    if (isWinner)
    {
        checkLevelStatus();
    }
}


//Render game elements using canvas
function renderGameElements() 
{
    context.clearRect(0, 0, gameWidth, gameHeight);

    //Ball Style
    context.fillStyle = "white";
    context.beginPath();
    context.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
    context.fill();

    //Paddle Style
    context.fillStyle = "cyan";
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    //Bricks Style
    context.fillStyle = "red";
    bricks.forEach(b => 
    {
        context.fillRect(b.x, b.y, b.width, b.height);
    });
}

//Render HUD elements such as lives, score, and level number
function renderHUD() 
{
    if (!context) return;

    context.fillStyle = "white";
    context.font = "16px Arial";
    context.fillText("Score: " + score, 10, 20);
    context.fillText("Lives: " + lives, 700, 20);
    context.fillText("Level: " + currentLevel, 360, 20);
}

//Mapping bricks in grids via for loop with nested for loop in both rows and columns
function loadLevel(levelGrid) 
{
    bricks = [];
    for (let row = 0; row < levelGrid.length; row++) 
    {
        for (let column = 0; column < levelGrid[row].length; column++) 
        {
            if (levelGrid[row][column] === 1) 
            {
                bricks.push({x: column * 80, y: row * 25, width: 75, height: 20});
            }
        }
    }
}

//Game loop
function gameLoop() 
{
    //Check if the player is in game after selecting level
    if (menuState !== "inGame") return;

    movePaddle();

    //The ball can move if it is not attached to the paddle
    if (!ballAttached) 
    {
        moveBall();
    } 
    else
    {
        //Keep the ball on paddle
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - ball.radius - 2;
    }

    checkCollisions();
    renderGameElements();
    renderHUD();

    requestAnimationFrame(gameLoop);
}


function updateLevel()
{
    if (!isGamePage || !canvas) return;
    console.log('next level');
    
    //Reattach ball to paddle after warping to next level
    ballAttached = true;

    //Center ball on paddle next frame
    ball.dx = 0;
    ball.dy = 0;

    //Reset paddle's position
    paddle.x = gameWidth / 2 - paddle.width / 2;
    paddle.y = gameHeight - paddle.height - 10;

    hitCount = 0; //Reset hits count

    //Load level from levels.js
    loadLevel(levels[currentLevel - 1]);
}

function checkLevelStatus()
{
//Using For loop to loop through levels to avoid out of bounds issue
    if (currentLevel == levels.length)
    {
        //If player has cleared the last level, then return to main menu
        window.location.href = "../index.html";
        menuState = "title";
    }
    else
    {
        //If the player hasn't yet reached last level then will warp to next level
        currentLevel++;
        reinitializeLevel();
        updateLevel();
    }
}

function reinitializeLevel()
{
     gameOver = false;
     menuState = "inGame"; 
}

function modifyBallSpeed(newSpeed)
{
    ballSpeed = newSpeed;

    //Keeping direction of ball using atan2 to keep the angle as in radians
    let angle = Math.atan2(ball.dy, ball.dx);

    //Apply new speed using sin and cosine formulas
    ball.dx = Math.cos(angle) * newSpeed;
    ball.dy = Math.sin(angle) * newSpeed;

    return newSpeed;
}

//-------------------- EVENT LISTENERS --------------------//

//Only add paddle controls during the game on game page
if (isGamePage) 
{
    window.addEventListener("load", () => init());

    //Input Key Down Press
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") paddleDirection = -1;
        if (e.key === "ArrowRight") paddleDirection = 1;
    });

    //Input Key Up Press
    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" && paddleDirection === -1) paddleDirection = 0;
        if (e.key === "ArrowRight" && paddleDirection === 1) paddleDirection = 0;
    });

    //Launch the ball when pressed space
    window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && ballAttached) 
    {
        ballAttached = false;
        ball.dx = ballSpeed * 0.2;
        ball.dy = -ballSpeed;
    }

    if (e.key === "ArrowLeft") paddleDirection = -1;
    if (e.key === "ArrowRight") paddleDirection = 1;
});
}