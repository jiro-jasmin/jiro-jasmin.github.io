const body = document.getElementById('body');
const start = document.getElementById('start');
const home = document.getElementById('home');
const countDownDiv = document.getElementById('countdown');
const credits = document.getElementById('toCredits');
const toHomepage = document.getElementById('toHomepage');

const eatingSound = new Audio('assets/audios/eating.mp3');
const gameOverSound = new Audio('assets/audios/gameover.mp3');
const bgMusic = new Audio('assets/audios/bg-music.mp3');

let mySnake;
let myApple;
let score;
let ctx; // contexte: pour afficher le serpent
let timeOut;
const delay = 75; // en millisecondes
const canvasWidth = 750; // en pixels
const canvasHeight = 450;
const blockSize = 30;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;

// Crée la fenêtre du jeu avec l'élément HTML canvas
function init() {
    let canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = '10px solid #809b9d';
    canvas.style.display = 'block'; // pour pouvoir le recentrer en css
    canvas.style.margin = '0 auto';
    canvas.style.backgroundColor = "#16171B";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d'); // 2 dimensions
    mySnake = new Snake([[6, 4], [5, 4], [4, 4]], 'right'); // cf Constructor
    myApple = new Apple([8, 8]);
    score = 0;
    bgMusic.play();
    refreshCanvas();
}

// Crée un nouveau serpent après chaque delai fixé
function refreshCanvas() {
    mySnake.advance();
    if (mySnake.checkCollision()) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        gameOverSound.play();
        gameOver();
    } else {
        if (mySnake.isEatingApple(myApple)) {
            score++;
            mySnake.ateApple = true;
            do {
                myApple.setNewPosition();
            }
            while (myApple.isOnSnake(mySnake)); // empêche la pomme de venir s'afficher sur le serpent
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawScore();
        mySnake.draw();
        myApple.draw();
        timeOut = setTimeout(refreshCanvas, delay);
    }
}

function gameOver() {
    ctx.save();
    ctx.font = "70px Major Mono Display, monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    let centreX = canvasWidth / 2;
    let centreY = canvasHeight / 2;
    ctx.strokeText("game over", centreX, centreY - 120);
    ctx.fillText("game over", centreX, centreY - 120);
    ctx.font = "30px Major Mono Display, monospace";
    ctx.strokeText("press space to replay", centreX, centreY + 120);
    ctx.fillText("press space to replay", centreX, centreY + 120);
    ctx.restore();
}

function restart() {
    bgMusic.play();
    mySnake = new Snake([[6, 4], [5, 4], [4, 4]], 'right');
    myApple = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeOut);
    refreshCanvas();
}

function drawScore() {
    ctx.save();
    ctx.font = "120px Major Mono Display, monospace";
    ctx.fillStyle = "#809b9d";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let centreX = canvasWidth / 2;
    let centreY = canvasHeight / 2;
    ctx.fillText(score.toString(), centreX, centreY);
    ctx.restore();
}

// Fixe les quatres coordonnees d'un bloc (mySnake = 3 blocs)
function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
}

// Constructor du Serpent:
// argument body = [[x0, y0],[x1, y1],[x2, y2]...]
// argument direction =  right/left/up/down
function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function () {
        ctx.save();
        ctx.fillStyle = "#43ff5c"; // couleur du serpent
        for (let i = 0; i < this.body.length; i++) { // longueur du serpent en blocs i
            drawBlock(ctx, this.body[i]);
        }
        ctx.restore();
    }
    this.advance = function () {
        // On modifie x0 ou y0 du 1er array (entree 0) de l'array body
        let nextPosition = this.body[0].slice(); // recupere la tete du serpent [x0, y0]
        switch (this.direction) {
            case 'left':
                nextPosition[0] -= 1; // x0 - 1
                break;
            case 'right':
                nextPosition[0] += 1; // x0 + 1
                break;
            case 'down':
                nextPosition[1] += 1; // y0 + 1
                break;
            case 'up':
                nextPosition[1] -= 1; // y0 - 1
                break;
            default:
                throw ("Invalid direction");
        }

        this.body.unshift(nextPosition); // ajoute nouvelle entree en 1ere position dans body (nouvelle tete du serpent)
        if (!this.ateApple) {
            this.body.pop(); // supprime la derniere entree de body (queue du serpent): il avance
        } else {
            this.ateApple = false; // pour ne pas pop (et donc ajouter un bloc au serpent) une seule fois: réinitialise à false après l'ajout
        }
    }
    this.setDirection = function (newDirection) {
        let allowedDirections; // Fixe des contraintes sur les directions possibles
        switch (this.direction) {
            case 'left':
            case 'right':
                allowedDirections = ['up', 'down'];
                break;
            case 'up':
            case 'down':
                allowedDirections = ['left', 'right'];
                break;
            default:
                throw ("Invalid direction");
        }
        // Si la valeur existe dans l'array, elle est permise : changer la direction
        if (allowedDirections.includes(newDirection)) {
            this.direction = newDirection;
        }
    }

    this.checkCollision = function () {
        let wallCollision = false;
        let snakeCollision = false;
        let head = this.body[0]; // c'est toujours la tête qui entrera en collision: la 1ère entrée de l'array [[x0, y0], ...]
        let rest = this.body.slice(1); // le reste du corps du serpent [... [x1, y1], [x2, y2]]
        let snakeX = head[0]; // x0
        let snakeY = head[1]; // y0
        let minX = 0;
        let minY = 0;
        let maxX = widthInBlocks - 1;
        let maxY = heightInBlocks - 1;
        let isNotBetweenXWalls = snakeX < minX || snakeX > maxX; // quand la tête sort du cadre en horizontal
        let isNotBetweenYWalls = snakeY < minY || snakeY > maxY; // quand la tête sort du cadre en vertical

        if (isNotBetweenXWalls || isNotBetweenYWalls) {
            wallCollision = true; // la tête entre en collision avec le mur
        }

        for (let i = 0; i < rest.length; i++) {
            if (snakeX === rest[i][0] && snakeY === rest[i][1]) // si la tête a le même x et le même y que le reste de son corps
                snakeCollision = true; // le serpent entre en collision avec lui-même
        }
        return wallCollision || snakeCollision;
    }

    this.isEatingApple = function (appleToEat) {
        let head = body[0];
        // Si le x et le y de la tête correspondent aux coordonnées de la pomme, il la mange
        if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
            eatingSound.play();
            return true;
        } else {
            return false;
        }
    }
}

// Constructor de la Pomme
function Apple(position) {
    this.position = position;
    this.draw = function () {
        ctx.save();
        ctx.fillStyle = "#df1a1a";
        // ctx.fillStyle = "#fff646";
        ctx.beginPath(); // nouveau chemin pour tracer la pomme (distinct du serpent)
        let radius = blockSize / 2;
        let x = this.position[0] * blockSize + radius;
        let y = this.position[1] * blockSize + radius;
        ctx.arc(x, y, radius, 0, Math.PI * 2, true); // dessine un cercle
        ctx.fill();
        ctx.restore();
    }
    this.setNewPosition = function () {
        let newX = Math.round(Math.random() * (widthInBlocks - 1)); // ici donne un entier entre 0 et 29
        let newY = Math.round(Math.random() * (heightInBlocks - 1)); // ici donne un entier entre 0 et 19
        this.position = [newX, newY];
    }
    this.isOnSnake = function (snakeToCheck) {
        let isOnSnake = false;

        for (let i = 0; i < snakeToCheck.body.length; i++) {
            if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                isOnSnake = true;
            }
        }
        return isOnSnake;
    }
}

// Commandes de directions du serpent
document.addEventListener('keydown', function (e) {
    let key = e.code;
    let newDirection;
    switch (key) {
        case 'ArrowLeft':
            newDirection = 'left';
            break;
        case 'ArrowRight':
            newDirection = 'right';
            break;
        case 'ArrowUp':
            newDirection = 'up';
            break;
        case 'ArrowDown':
            newDirection = 'down';
            break;
        case 'Space':
            restart();
            return; // pour ne pas lancer la methode setDirection() ici
        default:
            return; // rien ne se passe si une touche autre est appuyee
    }
    mySnake.setDirection(newDirection);
});


function countDown(i, callback) {
    timer = setInterval(function () {
        countDownDiv.innerText = i;
        i-- || (clearInterval(timer), callback());
    }, 1000);
}


start.addEventListener('click', () => {
    eatingSound.play();
    home.style.display = 'none';
    countDownDiv.style.display = 'block';
    countDownDiv.innerText = 3;
    countDown(2, () => {
        countDownDiv.style.display = 'none';
        init();
    });
});

credits.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.rules').style.display = 'none';
    document.querySelector('.credits').style.display = 'block';
});

toHomepage.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.credits').style.display = 'none';
    document.querySelector('.rules').style.display = 'block';
});