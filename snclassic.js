// Selecciona el elemento del tablero de juego
const playBoard = document.querySelector(".play-board"); 
// Seleccionamos el elemento de score o puntaje 
const scoreElement = document.querySelector(".score"); 
// Seleccionamos el elemento de high-score o puntaje alto
const highScoreElement = document.querySelector(".high-score"); 

// Inicia el estado de juego finalizado 
let gameOver = false;   
// Variables para la posicion de la comida 
let foodX, foodY;     
// Variable para la posicion inicial de la serpiente  
let snakeX = 15, snakeY = 15; 
//Array que almacena el cuerpo de la serpiente
let snakeBody = []; 
//Variables de la velocidad de la serpiente
let velocityX = 0, velocityY = 0; 
// Identificador del intervalo del juego.
let setIntervalId; 
//Valor inicial del puntaje
let score = 0; 

// Obtiene la alta puntuación del almacenamiento local, o la establece a 0 si no existe.
let highScore = localStorage.getItem("high-score") || 0; 
highScoreElement.innerHTML = `High Score: ${highScore}`;

// Función que cambia la posición de la comida a una posición aleatoria en el tablero 30x30 
const changFoodPosition = () => { 
        foodX = Math.floor(Math.random()*30) + 1;
        foodY = Math.floor(Math.random()*30) + 1;
}

// Función que maneja el fin del juego.
const handleGameOver = () => {
    clearInterval(setIntervalId) 
    alert("game over");
    location.reload();
}

// Función que cambia la dirección de la serpiente basado en la tecla presionada.
const changeDirection = (e) => {
//la condicion para moverse, en este caso hay 2 teclas asignadas mas una condicion para evitar moverse a la direccion contraria forzando a la serpiente tener que dar la vuelta (velocityX o Y != 1/-1)
    if((e.key === "ArrowUp" || e.key === "W") && velocityY != 1) {  
        velocityX = 0; 
        velocityY = -1;
    } else if((e.key === "ArrowDown" || e.key === "S") && velocityY != -1) {
        velocityX = 0; 
        velocityY = 1;
    } else if((e.key === "ArrowLeft" || e.key === "A") && velocityX != 1) {
        velocityX = -1; 
        velocityY = 0;
    } else if((e.key === "ArrowRight" || e.key === "D") && velocityX != -1) {
        velocityX = 1; 
        velocityY = 0;
    };
    initGame();   //una vez presionada cualquier tecla, inicia el juego
}

// Función encargada iniciar y actualiza el estado del juego.
const initGame = () => {
    // Maneja el fin del juego si es necesario.
    if(gameOver) return handleGameOver(); 
    let htmlMarkup = `<div class="food" style="grid-area:${foodY} / ${foodX}"></div>`;
 // Funcion que permite a la serpiente comer 
    if (snakeX === foodX && snakeY === foodY) {
        changFoodPosition()
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score: highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
    
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }
 // Mueve el cuerpo de la serpiente.
    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY; 
 // Comprueba si la serpiente ha chocado con los bordes del tablero.
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
// Genera el cuerpo de la serpiente en el tablero y comprueba si ha chocado consigo misma.
    for(let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
// Inicializa la posición de la comida.
changFoodPosition();
// Establece un intervalo para actualizar el estado del juego cada 125 milisegundos.
setIntervalId = setInterval(initGame, 125)
// Añade un evento de escucha para las teclas presionadas y cambia la dirección de la serpiente.
document.addEventListener("keydown", changeDirection);